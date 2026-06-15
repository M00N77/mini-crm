import { Request, Response } from 'express';
import * as userService from '../services/users';

export async function getUsers(req: Request, res: Response) {
  const users = await userService.getAllUsers();
  res.json(users);
}

export async function getUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  const user = await userService.getUserById(id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json(user);
}

export async function createUser(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await userService.createUser(email, password);
  res.status(201).json(user);
}
