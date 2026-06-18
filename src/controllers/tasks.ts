import { Request, Response } from 'express';
import * as tasksService from '../services/tasks';

export async function getTasks(req: Request, res: Response) {
    if (!req.user) return res.status(401)
    const userId  = Number(req.user.id);
    const result = await tasksService.getAllTasksByUserId(userId);

    return res.status(200).send(result);
}

export async function getTaskByIdAndUserId(req: Request, res: Response) {
    if (!req.user) return res.status(401)
    const id = req.params.id;
    const userId = req.user.id;
    const result = await tasksService.getTaskByIdAndUserId(Number(id),Number(userId));

    return res.status(200).send(result);
}

export async function createTask(req: Request, res: Response) {
    if (!req.user) return res.status(401)
    const {title, description, status} = req.body;
    const result = await tasksService.createTask(title, description, Number(req.user.id),status);

    return res.status(201).json(result);
}

export async function updateTask(req: Request, res: Response) {
    if (!req.user) return res.status(401)
    const id = Number(req.params.id);
    const {title,description, status} = req.body;
    const result = await tasksService.updateTask(Number(id),Number(req.user.id),{title:title,description:description,status:status});

    return res.status(201).json(result);
}

export async function deleteTask(req: Request, res: Response) {
    if (!req.user) return res.status(401)
    const id = Number(req.params.id);
    const userId = Number(req.user.id);

    const result = await tasksService.deleteTask(id,userId);
    return res.status(200).send(result);
}
