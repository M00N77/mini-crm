import { Request, Response } from "express";
import * as userService from "../services/users";
import { AppError } from "../utils/AppError";

export async function getUsers(req: Request, res: Response) {
  const users = await userService.getAllUsers();
  return res.json(users);
}

export async function getUser(req: Request, res: Response) {
  const id = req.params.id;
  const user = await userService.getUserById(Number(id));

  return res.status(200).json(user);
}

export async function createUser(req: Request, res: Response) {
  const { email, password, name } = req.body;
  const user = await userService.createUser(email, password, name);
  return res.status(201).json(user);
}

export async function deleteUser(req: Request, res: Response) {
  const id = req.params.id;
  await userService.deleteUserById(Number(id));

  return res.status(200).json({ message: "deleted successfully." });
}

export async function getUserInfo(req: Request, res: Response) {
  if (!req.user) throw new AppError("You are not logged in", 401);

  const { userId } = req.user;

  const result = await userService.getUserInfo(userId);

  return res.status(200).json(result);
}
