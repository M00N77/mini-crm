import { Request, Response } from 'express';
import * as serviceNotes from '../services/notes';


export async function getAllNotes(req:Request, res:Response){
    if (!req.user) return res.status(401).json({message: 'You are not logged in!'});
    const userId = Number(req.user.id);
    const result = await serviceNotes.getAllNotesById(userId)

    res.status(200).send(result)
}

export async function getNote(req:Request, res:Response){
    if (!req.user) return res.status(401).json({message: 'You are not logged in!'});
    const noteId = Number(req.params.id);
    const userId = Number(req.user.id);
    const result = await serviceNotes.getNoteById(userId, noteId);

    res.status(200).send(result)
}

export async function createNote(req:Request, res:Response){
    if (!req.user) return res.status(401).json({message: 'You are not logged in!'});
    const userId = Number(req.user.id);
    const {contactId, content } = req.body;
    const result = await serviceNotes.createNote(userId, contactId, content);

    res.status(201).send(result)
}

export async function updateNote(req:Request, res:Response){
    if (!req.user) return res.status(401).json({message: 'You are not logged in!'});
    const noteId = Number(req.params.id);
    const userId = Number(req.user.id);
    const content = String(req.body.content);
    const result = await serviceNotes.updateNote(userId, noteId, content);

    res.status(200).send(result)
}

export async function deleteNote(req:Request, res:Response){
    if (!req.user) return res.status(401).json({message: 'You are not logged in!'});
    const noteId = Number(req.params.id);
    const userId = Number(req.user.id);

    const result = await serviceNotes.deleteNote(userId, noteId);
    res.status(200).send(result)
}
