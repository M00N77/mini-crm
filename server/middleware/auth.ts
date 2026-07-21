import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../types/types";
import { AppError } from "../utils/AppError";
import bcrypt from "bcrypt";
import pool from "../db";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-prod";

export async function verificationAccessToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { authorization } = req.headers;

  try {
    const token = authorization?.split(" ")[1];
    if (!token) return res.status(401).json({message:'Invalid session'});
    const secretKey = JWT_SECRET;
    const decode = jwt.verify(token, secretKey) as TokenPayload;
    req.user = decode;
    next();
  } catch(e : any) {
      if(e instanceof Error && e.name==='TokenExpiredError') return next(new AppError('Token Expired',403));
      if(e instanceof Error && e.name==='JsonWebTokenError') return next(new AppError('Invalid token',401));
      return next(new AppError("Authentication failed", 500));
  }
}

export async function verificationRefreshToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token } = req.cookies;
    if (!token) return next(new AppError('Token undefined',401))
    const decode = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.user = decode;
    next();
  } catch (e){
    if(e instanceof Error && e.name === 'TokenExpiredError') return next(new AppError('Token Expired',403));
    if(e instanceof Error && e.name==='JsonWebTokenError') return next(new AppError('Invalid token',401));
    return next(new AppError("Authentication failed", 500));
  }
}

export async function checkNewPasswordDiffers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword) throw new AppError("Old password is require", 400);
  if (!newPassword) throw new AppError("New password is require", 400);
  if (oldPassword === newPassword)
    throw new AppError("New password must be different from old password", 400);
  next();
}

export async function verifyOldPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new AppError("You are not login in", 401);
    const { oldPassword } = req.body;

    const result = await pool.query(
      "select hashedPassword from users where id = $1",
      [req.user.userId],
    );
    if (result.rows.length === 0) throw new AppError("User not found", 404);

    const isValid = await bcrypt.compare(
      oldPassword,
      result.rows[0].hashedPassword,
    );
    if (!isValid) throw new AppError("Invalid old password", 401);
    next();
  } catch (e) {
    next(e);
  }
}
