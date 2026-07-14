import pool from "../db";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { TokenPayload } from "../types/types";
import { AppError } from "../utils/AppError";
import { verificationAccessToken } from "../middleware/auth";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-prod";

async function generateRefreshToken(payload: TokenPayload, secretKey: string) {
  const timeForRefreshToken = { expiresIn: "7d" as const };
  const refreshTokenExpiresIn = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const jti = crypto.randomUUID();
  const { userId, email } = payload;
  const refreshTokenPayload = {
    userId: userId,
    email: email,
    jti: jti,
  };
  const refreshToken = jwt.sign(
    refreshTokenPayload,
    secretKey,
    timeForRefreshToken,
  );
  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await pool.query(
    "insert into refresh_tokens (user_id,token_hash,expires_at,jti) values ($1,$2,$3,$4) returning *",
    [userId, hashedRefreshToken, refreshTokenExpiresIn, jti],
  );

  return { refreshToken, hashedRefreshToken };
}

export async function rotateRefreshToken(curRefreshToken: string) {
  try {
    const secretKey = JWT_SECRET;
    const payload = jwt.verify(curRefreshToken, secretKey) as TokenPayload;

    const row = (
      await pool.query(
        "select * from refresh_tokens where user_id=$1 and jti=$2",
        [payload.userId, payload.jti],
      )
    ).rows;
    if (row.length === 0) return null;

    const isValid =
      crypto.createHash("sha256").update(curRefreshToken).digest("hex") ===
      row[0].token_hash;
    if (!isValid) throw new AppError("Invalid refresh token", 401);

    await pool.query(
      "delete from refresh_tokens where user_id=$1 and jti=$2 returning *",
      [row[0].user_id, row[0].jti],
    );

    const { refreshToken } = await generateRefreshToken(payload, secretKey);
    const timeForAccessToken = { expiresIn: "15m" as const };
    const newPayload = {
      userId: payload.userId,
      email: payload.email,
    };
    const accessToken = jwt.sign(newPayload, secretKey, timeForAccessToken);

    return { refreshToken, accessToken };
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      throw new AppError("Token Expired", 403);
    } else if (err.name === "JsonWebTokenError") {
      throw new AppError("Invalid token", 401);
    }
    throw new AppError("Failed refresh", 500);
  }
}

export async function registerUser(
  email: string,
  password: string,
  name: string,
) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await pool.query(
      "insert into users (email,hashed_password,name) values($1,$2,$3) returning id,email,name,created_at",
      [email, hashedPassword, name],
    );
    const payload: TokenPayload = {
      userId: result.rows[0].id,
      email: email,
    };

    const secretKey = JWT_SECRET;
    const timeForAccessToken = { expiresIn: "15m" as const };

    const accessToken = jwt.sign(payload, secretKey, timeForAccessToken);

    const { refreshToken } = await generateRefreshToken(payload, secretKey);

    return {
      user: result.rows[0],
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  } catch (err: any) {
    if ((err as any)?.code === "23505")
      throw new AppError("Email already exists", 409);
    throw new AppError(`error: ${err.message}`, 500);
  }
}

export async function loginUser(email: string, password: string) {
  const user = await pool.query("select * from users where email=$1", [email]);

  if (user.rows.length === 0)
    throw new AppError("Invalid email or password", 401);

  const isValidPassword = await bcrypt.compare(
    password,
    user.rows[0].hashed_password,
  );
  if (!isValidPassword) throw new AppError("Invalid email or password", 401);
  const { hashed_password, ...userWithoutPassword } = user.rows[0];

  const secretKey = JWT_SECRET;

  const payload: TokenPayload = {
    userId: user.rows[0].id,
    email: email,
  };

  const accessToken = jwt.sign(payload, secretKey, {
    expiresIn: "15m" as const,
  });
  const { refreshToken } = await generateRefreshToken(payload, secretKey);

  return {
    user: userWithoutPassword,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
}

export async function logoutUser(refreshToken: string) {
  if (!refreshToken) return;
  try {
    const secretKey = JWT_SECRET;
    const payload = jwt.verify(refreshToken, secretKey, {
      ignoreExpiration: true,
    }) as TokenPayload;
    const { jti, userId } = payload;

    await pool.query(
      "delete from refresh_tokens where user_id=$1 and jti=$2 returning *",
      [userId, jti],
    );
  } catch (e) {}
}
export async function changePassword(userId: number, password: string) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const result = await pool.query(
    "update users set hashed_password = $1 where id = $2 returning id",
    [hashedPassword, userId],
  );
  if (result.rows.length === 0) throw new AppError("Password not changed", 500);

  return result.rows[0];
}
