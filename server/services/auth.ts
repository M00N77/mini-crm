import pool from "../db";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { TokenPayload } from "../types/types";
import { AppError } from "../utils/AppError";
import * as authRepository from "../repositories/auth.repository";
import { UserDto } from "../mappers/auth.mapper";
import { TokenService } from "../utils/generateTokenPair";

const JWT_SECRET: string = (() => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return secret;
})();

export async function rotateRefreshToken(curRefreshToken: string) {
  const secretKey = JWT_SECRET;
  let payload: TokenPayload;
  try {
    payload = jwt.verify(curRefreshToken, secretKey, {
      algorithms: ["HS256"],
    }) as TokenPayload;
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      throw new AppError("Token Expired", 403);
    } else if (err.name === "JsonWebTokenError") {
      throw new AppError("Invalid token", 401);
    }
    throw new AppError("Failed refresh", 500);
  }
  if (!payload.jti) throw new AppError("Invalid token", 401);

  const client = await pool.connect();
  let committed = false;
  try {
    await client.query("begin");

    const revokeResult = await client.query(
      `update refresh_tokens
         set revoked_at = now()
       where user_id = $1 and jti = $2 and revoked_at is null
       returning *`,
      [payload.userId, payload.jti],
    );

    if (!revokeResult.rowCount) {
      const existing = await authRepository.findRefresh(
        client,
        payload.userId,
        payload.jti,
      );

      if (existing) {
        if (existing.revoked_at) {
          // Токен уже отозван ротацией — возможна гонка параллельных запросов
          const diffTime = Date.now() - new Date(existing.revoked_at).getTime();
          if (diffTime < 15000) {
            throw new AppError("Concurrent refresh request", 409);
          }
          // Старый отозванный токен — просто отказ, сессии не трогаем
          throw new AppError("Invalid refresh token", 401);
        }
        // Активный токен есть в БД, но revoke не сработал — не должно происходить
        throw new AppError("Invalid refresh token", 401);
      }

      // Валидный по подписи JWT с jti, которого нет в БД, — токен вне нашей
      // выдачи (подделан/утёк до первого использования) → гасим все сессии
      await client.query("delete from refresh_tokens where user_id = $1", [
        payload.userId,
      ]);
      await client.query("commit");
      committed = true;
      throw new AppError("Token reuse detected", 401);
    }

    const row = revokeResult.rows[0];

    const providedHashBuf = Buffer.from(
      crypto.createHash("sha256").update(curRefreshToken).digest("hex"),
    );
    const storedHashBuf = Buffer.from(row.token_hash);

    const isValid =
      providedHashBuf.length === storedHashBuf.length &&
      crypto.timingSafeEqual(providedHashBuf, storedHashBuf);

    if (!isValid) throw new AppError("Invalid refresh token", 401);

    const { accessToken, refreshToken, hashedRefreshToken, expiresAt, jti } =
      TokenService.generatePair(
        { userId: payload.userId, email: payload.email },
        secretKey,
      );
    await client.query(
      "insert into refresh_tokens (user_id,token_hash,expires_at,jti) values ($1,$2,$3,$4) returning *",
      [payload.userId, hashedRefreshToken, expiresAt, jti],
    );
    await client.query("commit");
    committed = true;

    return { refreshToken, accessToken };
  } catch (err: any) {
    if (!committed) await client.query("rollback");
    if (err instanceof AppError) throw err;
    throw new AppError("Failed refresh", 500);
  } finally {
    client.release();
  }
}

export async function registerUser(
  email: string,
  password: string,
  name: string,
) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const client = await pool.connect();
  let committed = false;
  try {
    await client.query("begin");
    const result = await client.query(
      "insert into users (email,hashed_password,name) values($1,$2,$3) returning id,email,name,created_at",
      [email, hashedPassword, name],
    );
    const payload: TokenPayload = {
      userId: result.rows[0].id,
      email: email,
    };

    const secretKey = JWT_SECRET;

    const { accessToken, refreshToken, hashedRefreshToken, expiresAt, jti } =
      TokenService.generatePair(payload, secretKey);
    await client.query(
      "insert into refresh_tokens (user_id,token_hash,expires_at,jti) values ($1,$2,$3,$4) returning *",
      [payload.userId, hashedRefreshToken, expiresAt, jti],
    );
    await client.query("commit");
    committed = true;

    return {
      user: new UserDto(result.rows[0]),
      accessToken,
      refreshToken,
    };
  } catch (err: any) {
    if (!committed) await client.query("rollback");
    if ((err as any)?.code === "23505")
      throw new AppError("Email already exists", 409);
    throw new AppError("Internal Server Error", 500);
  } finally {
    client.release();
  }
}

export async function loginUser(email: string, password: string) {
  const client = await pool.connect();
  let committed = false;

  try {
    await client.query("begin");
    const user = await authRepository.emailTaken(client, email);

    if (!user) throw new AppError("Invalid email or password", 401);

    const isValidPassword = await bcrypt.compare(
      password,
      user.hashed_password,
    );
    if (!isValidPassword) throw new AppError("Invalid email or password", 401);
    const { hashed_password, ...userWithoutPassword } = user;

    const secretKey = JWT_SECRET;

    const payload: TokenPayload = {
      userId: user.id,
      email: email,
    };

    const { accessToken, refreshToken, hashedRefreshToken, expiresAt, jti } =
      TokenService.generatePair(payload, secretKey);
    await client.query(
      "insert into refresh_tokens (user_id,token_hash,expires_at,jti) values ($1,$2,$3,$4) returning *",
      [payload.userId, hashedRefreshToken, expiresAt, jti],
    );
    await client.query("commit");
    committed = true;
    return {
      user: new UserDto(userWithoutPassword),
      accessToken,
      refreshToken,
    };
  } catch (e: any) {
    if (!committed) await client.query("rollback");
    if (e instanceof AppError) throw e;
    throw new AppError("Internal Server Error", 500);
  } finally {
    client.release();
  }
}

export async function logoutUser(refreshToken: string) {
  if (!refreshToken) return;
  try {
    const secretKey = JWT_SECRET;
    const payload = jwt.verify(refreshToken, secretKey, {
      ignoreExpiration: true,
      algorithms: ["HS256"],
    }) as TokenPayload;
    const { jti, userId } = payload;

    await pool.query(
      "delete from refresh_tokens where user_id=$1 and jti=$2 returning *",
      [userId, jti],
    );
  } catch (e) {
    console.error("Logout cleanup failed:", e);
  }
}
export async function changePassword(userId: number, password: string) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const client = await pool.connect();
  let committed = false;
  try {
    await client.query("begin");
    const result = await client.query(
      "update users set hashed_password = $1 where id = $2 returning id",
      [hashedPassword, userId],
    );
    if (result.rows.length === 0) {
      throw new AppError("Password not changed", 500);
    }
    await client.query("delete from refresh_tokens where user_id = $1", [
      userId,
    ]);
    await client.query("commit");
    committed = true;

    return result.rows[0];
  } catch (err: any) {
    if (!committed) await client.query("rollback");
    if (err instanceof AppError) throw err;
    throw new AppError("Internal Server Error", 500);
  } finally {
    client.release();
  }
}