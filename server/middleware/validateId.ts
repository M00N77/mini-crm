import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export function validateId(req: Request, res: Response, next: NextFunction) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return next(new AppError("Invalid id", 400));
  }
  next();
}
