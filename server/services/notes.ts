import {paginate} from "../utils/paginate";
import { resolveSort } from "../utils/sort";
import { AppError } from "../utils/AppError";
import { NoteDto } from "../mappers/note.mapper";
import * as notesRepository from '../repositories/notes.repository';

const NOTE_SORT: Record<string, string> = {
  content: "notes.content",
  createdAt: "notes.created_at",
};

export async function getNotes(userId:number,pageInput:number,limitInput:number, sortBy?: string, order?: string) {
    const { orderBy, orderDir } = resolveSort(sortBy, order, NOTE_SORT, { orderBy: "notes.id", orderDir: "ASC" });
    const { rows, pagination: paginationData } = await paginate({
        fromClause: 'notes join contacts on contacts.id = notes.contact_id',
        columns: 'notes.*',
        userIdColumn: 'contacts.user_id',
        userId,
        orderBy,
        orderDir,
        pageInput,
        limitInput,
    });
    const { offset, limit, ...pagination } = paginationData
    return {
        "data": rows.map((row) => new NoteDto(row)),
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
    if (!row) throw new AppError("Note not found", 404);
    return new NoteDto(row);
}

export async function deleteNote(userId:number,noteId:number){
    const row = await notesRepository.deleteNote(userId, noteId);
    if (!row) throw new AppError("Note not found", 404);
    return new NoteDto(row);
}