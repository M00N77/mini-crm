import { Request, Response } from 'express';
import * as contactsService from '../services/contacts';

import {AppError} from "../utils/AppError";



export async function getContacts(req: Request, res: Response) {
    if (!req.user) throw new AppError('You are not logged in', 401);
    const userId = Number(req.user.userId);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await contactsService.getContacts(userId, page, limit)

    res.status(200).send(result);
}

export async function getContactById(req: Request, res: Response) {
    if (!req.user) throw new AppError('You are not logged in', 401);
    const userId = Number(req.user.userId);
    const id = Number(req.params.id);
    const result = await contactsService.getContactById(userId,id)

    res.status(200).send(result);
}

export async function createContact(req: Request, res: Response) {
    if (!req.user) throw new AppError('You are not logged in', 401);
    const userId = Number(req.user.userId);
    const { name,email, phone} = req.body;

    const result = await contactsService.createContact(userId,name,email,phone);
    res.status(201).send(result);
}

export async function updateContact(req: Request, res: Response) {
    if (!req.user) throw new AppError('You are not logged in', 401);
    const userId = Number(req.user.userId);
    const id = Number(req.params.id);
    const { name,email, phone } = req.body;
    const result = await contactsService.updateContact(userId,id,{name,email,phone});
    res.status(201).send(result);
}
export async function deleteContact (req: Request, res: Response) {
    if (!req.user) throw new AppError('You are not logged in', 401);
    const id = Number(req.params.id);
    const userId = Number(req.user.userId);

    const result = await contactsService.deleteContact(userId,id)
    res.status(200).send(result);
}