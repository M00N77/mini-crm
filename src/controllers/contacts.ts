import { Request, Response } from 'express';
import * as contactsService from '../services/contacts';



export async function getContacts(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({message: 'You are not logged in!'});
    const userId = Number(req.user.id);
    const result = await contactsService.getContacts(userId)

    res.status(200).send(result);
}

export async function getContactById(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({message: 'You are not logged in!'});
    const userId = Number(req.user.id);
    const id = Number(req.params.id);
    const result = await contactsService.getContactById(userId,id)

    res.status(200).send(result);
}

export async function createContact(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({message: 'You are not logged in!'});
    const userId = Number(req.user.id);
    const { name,email, phone} = req.body;

    const result = await contactsService.createContact(userId,name,email,phone);
    res.status(201).send(result);
}

export async function updateContact(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({message: 'You are not logged in!'});
    const userId = Number(req.user.id);
    const id = Number(req.params.id);
    const { name,email, phone } = req.body;
    const result = await contactsService.updateContact(userId,id,{name,email,phone});
    res.status(201).send(result);
}
export async function deleteContact (req: Request, res: Response) {
    if (!req.user) return res.status(401).json({message: 'You are not logged in!'});
    const id = Number(req.params.id);
    const userId = Number(req.user.id);

    const result = await contactsService.deleteContact(userId,id)
    res.status(200).send(result);
}