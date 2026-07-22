import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export function validateUser(req: Request, res: Response, next: NextFunction) {
  if (!req.user) throw new AppError("Invalid session", 401);
  if (req.user.userId < 0) throw new AppError("Invalid userId", 401);
  next();
}
