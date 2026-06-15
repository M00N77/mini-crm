import { Request, Response } from 'express';
import * as tasksService from '../services/tasks';

export async function getTasks(req: Request, res: Response) {
    const  id  = req.query.userId
    const result = await tasksService.getAllTasksByUserId(Number(id));

    return res.status(200).send(result);
}

export async function getTaskByIdAndUserId(req: Request, res: Response) {
    const id = req.params.id;
    const userId = req.query.userId;
    const result = await tasksService.getTaskByIdAndUserId(Number(id),Number(userId));

    return res.status(200).send(result);
}

export async function createTask(req: Request, res: Response) {
    const {title, description, userId, status} = req.body;
    const result = await tasksService.createTask(title, description, Number(userId),status);

    return res.status(201).json(result);
}

export async function updateTask(req: Request, res: Response) {
    const id = Number(req.params.id);
    const {userId,title,description, status} = req.body;
    const result = await tasksService.updateTask(Number(id),Number(userId),{title:title,description:description,status:status});

    return res.status(201).json(result);
}

export async function deleteTask(req: Request, res: Response) {
    const id = Number(req.params.id);
    const userId = Number(req.query.userId);

    const result = await tasksService.deleteTask(id,userId);
    return res.status(200).send(result);
}
