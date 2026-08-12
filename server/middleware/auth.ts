import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../types/types";
import { AppError } from "../utils/AppError";
import bcrypt from "bcrypt";
import pool from "../db";
const JWT_SECRET: string = (() => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return secret;
})();

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
    const decode = jwt.verify(token, secretKey, {
      algorithms: ["HS256"],
    }) as TokenPayload;
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
    const decode = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    }) as TokenPayload;
    req.user = decode;
    next();
  } catch (e){
    if(e instanceof Error && e.name === 'TokenExpiredError') return next(new AppError('Token Expired',403));
    if(e instanceof Error && e.name==='JsonWebTokenError') return next(new AppError('Invalid token',401));
    return next(new AppError("Authentication failed", 500));
  }
}

export async function verifyOldPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { oldPassword } = req.body;

    const result = await pool.query(
      "select hashed_password from users where id = $1",
      [req.user.userId],
    );
    if (result.rows.length === 0) throw new AppError("User not found", 404);

    const isValid = await bcrypt.compare(
      oldPassword,
      result.rows[0].hashed_password,
    );
    if (!isValid) throw new AppError("Invalid old password", 401);
    next();
  } catch (e) {
    next(e);
  }
};

export async function validateUser(req:Request,res:Response,next:NextFunction) {
  if(!req.user){ throw new AppError('Invalid session',401)}
  next()
}
