import { Request, Response } from 'express';
import * as tasksService from '../services/tasks';
import {AppError} from "../utils/AppError";

export async function getTasks(req: Request, res: Response) {
    const userId  = Number(req.user.userId);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await tasksService.getTasks(userId, page, limit);

    return res.status(200).send(result);
}

export async function getTaskById(req: Request, res: Response) {
    const id = req.params.id;
    const userId = req.user.userId;
    const result = await tasksService.getTaskById(Number(id),Number(userId));

    return res.status(200).send(result);
}

export async function createTask(req: Request, res: Response) {
    const {title, description, status, position} = req.body;
    const result = await tasksService.createTask(title, description, Number(req.user.userId),status, position);

    return res.status(201).json(result);
}

export async function updateTask(req: Request, res: Response) {
    const id = Number(req.params.id);
    const {title,description, status, position} = req.body;
    const result = await tasksService.updateTask(Number(id),Number(req.user.userId),{title:title,description:description,status:status,position:position});

    return res.status(200).json(result);
}

export async function deleteTask(req: Request, res: Response) {
    const id = Number(req.params.id);
    const userId = Number(req.user.userId);

    const result = await tasksService.deleteTask(id,userId);
    return res.status(200).send(result);
}
