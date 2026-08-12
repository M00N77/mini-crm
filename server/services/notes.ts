import {paginate} from "../utils/paginate";
import { AppError } from "../utils/AppError";
import { NoteDto } from "../mappers/note.mapper";
import * as notesRepository from '../repositories/notes.repository';

export async function getNotes(userId:number,pageInput:number,limitInput:number) {
    const paginateData = await paginate('notes join contacts on contacts.id = notes.contact_id',pageInput,limitInput,'contacts.user_id',userId);
    const {offset, ...pagination} = paginateData
    const rows = await notesRepository.findNotes(userId, offset, paginateData.limit);
    return {
        "data": rows.map((row: any) => new NoteDto(row)),
        "pagination": pagination
    }
}

export async function getNoteById(userId:number,noteId: number){
    const row = await notesRepository.findNoteById(userId, noteId);
    if (!row) throw new AppError("Note not found", 404);
    return new NoteDto(row);
}

export async function createNote(userId:number,contactId:number,content:string){
    const row = await notesRepository.createNote(userId, contactId, content);
    if (!row) throw new AppError("Contact not found", 404);
    return new NoteDto(row);
}

export async function updateNote(userId:number,noteId:number,content:string){
    const row = await notesRepository.updateNote(userId, noteId, content);
    if(row) {
        return new NoteDto(row);
    }
    throw new AppError("Note not found", 404);
}

export async function deleteNote(userId:number,noteId:number){
    const row = await notesRepository.deleteNote(userId, noteId);
    if (!row) throw new AppError("Note not found", 404);
    return new NoteDto(row);
}