
import { Request, Response } from 'express';
import * as contactsService from '../services/contacts';

import {AppError} from "../utils/AppError";



export async function getContacts(req: Request, res: Response) {
    const userId = Number(req.user.userId);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await contactsService.getContacts(userId, page, limit)

    return res.status(200).send(result);
}

export async function getContactById(req: Request, res: Response) {
    const userId = Number(req.user.userId);
    const id = Number(req.params.id);
    const result = await contactsService.getContactById(userId,id)

    return res.status(200).send(result);
}

export async function createContact(req: Request, res: Response) {
    const userId = Number(req.user.userId);
    const { name,email, company,jobPosition,phone} = req.body;

    const result = await contactsService.createContact(userId,name,email,company,jobPosition,phone);
    return res.status(201).send(result);
}

export async function updateContact(req: Request, res: Response) {
    const userId = Number(req.user.userId);
    const id = Number(req.params.id);
    const { name,email, company,jobPosition,phone } = req.body;
    const result = await contactsService.updateContact(userId,id,{name,email, company,jobPosition,phone});
    return res.status(200).send(result);
}
export async function deleteContact (req: Request, res: Response) {
    const id = Number(req.params.id);
    const userId = Number(req.user.userId);

    const result = await contactsService.deleteContact(userId,id)
    return res.status(200).send(result);
}
