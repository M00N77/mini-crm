import * as service from "../services/auth";
import { Request, Response } from "express";
import { AppError } from "../utils/AppError";

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
export async function registerUser(req: Request, res: Response) {
  const { email, password, name } = req.body;
  const result = await service.registerUser(email, password, name);

  const { refreshToken, ...resultWithoutRefresh } = result;
  res.cookie("token", refreshToken, refreshCookieOptions);
  return res.status(201).send(resultWithoutRefresh);
}

export async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;
  const result = await service.loginUser(email, password);

  const { refreshToken, ...resultWithoutRefresh } = result;
  res.cookie("token", refreshToken, refreshCookieOptions);

  return res.status(200).send(resultWithoutRefresh);
}

export async function refreshUser(req: Request, res: Response) {
  const oldRefresh = req.cookies.token;
  const result = await service.rotateRefreshToken(oldRefresh);
  if (!result) throw new AppError("Invalid refresh token", 401);

  const { refreshToken, ...resultWithoutRefresh } = result;
  res.cookie("token", refreshToken, refreshCookieOptions);

  return res.status(200).send(resultWithoutRefresh);
}

export async function logoutUser(req: Request, res: Response) {
  await service.logoutUser(req.cookies.token);

  res.clearCookie("token", { path: "/" });
  return res.status(200).json({ message: "User logged out" });
}

export async function changePassword(req: Request, res: Response) {
  const { userId } = req.user;
  const password = req.body.newPassword;
  await service.changePassword(userId, password);

  return res.status(200).json({ message: "Password changed successfully" });
}
