import { Request, Response } from "express";
import * as userService from "../services/users";
import { AppError } from "../utils/AppError";


export async function getUsers(req: Request, res: Response) {
  const pageInput = Number(req.query.page)
  const limitInput = Number(req.query.limit)
  const { userId } = req.user;

  const users = await userService.getUsers(userId,pageInput,limitInput,);
  return res.json(users);
}

export async function getUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (req.user.userId !== id) throw new AppError("Forbidden", 403);

  const user = await userService.getUserById(id);

  return res.status(200).json(user);
}

export async function deleteUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (req.user.userId !== id) throw new AppError("Forbidden", 403);

  await userService.deleteUser(id);

  return res.status(200).json({ message: "deleted successfully." });
}

export async function getUserInfo(req: Request, res: Response) {
  const { userId } = req.user;

  const result = await userService.getUserInfo(userId);

  return res.status(200).json(result);
}
