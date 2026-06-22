import { Request, Response } from 'express';
import * as userService from '../services/users';

export async function getUsers(req: Request, res: Response) {
  const users = await userService.getAllUsers();
  res.json(users);
}

export async function getUser(req: Request, res: Response) {
  const id = req.params.id;
  const user = await userService.getUserById(Number(id))
    if (!user) return res.status(404).json({message: 'No user with id ' + id});

    res.status(200).json(user);

}

export async function createUser(req: Request, res: Response) {
  const { email, password, name } = req.body;
  const user = await userService.createUser(email, password, name);
  res.status(201).json(user);
}

export async function deleteUser (req: Request, res: Response) {
  const id = req.params.id;

  const result  = await userService.deleteUserById(Number(id));

  if(result) return res.status(200).json({message:'deleted successfully.'});


  res.status(404).json({message:'no user with id ' + id});
}