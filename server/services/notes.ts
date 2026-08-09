import pool from "../db";
import {paginate} from "../utils/paginate";
import { AppError } from "../utils/AppError";
import { NoteDto } from "../mappers/note.mapper";

export async function getNotes(userId:number,pageInput:number,limitInput:number) {
    const paginateData = await paginate('notes join contacts on contacts.id = notes.contact_id',pageInput,limitInput,'contacts.user_id',userId);
    const {offset, ...pagination} = paginateData
    const result = await pool.query('select notes.* from notes join contacts on contacts.id = notes.contact_id where contacts.user_id = $1 offset $2 limit $3 ',[userId,offset,paginateData.limit]);
    return {
        "data": result.rows.map((row) => new NoteDto(row)),
        "pagination": pagination
    }
}

export async function getNoteById(userId:number,noteId: number){
    const result = await pool.query('select notes.* from notes join contacts on contacts.id = notes.contact_id where contacts.user_id = $1 and notes.id = $2', [userId,noteId]);

    const row = result.rows[0];
    if (!row) throw new AppError("Note not found", 404);
    return new NoteDto(row);
}

export async function createNote(userId:number,contactId:number,content:string){
    const isHavingContact = await pool.query('select * from contacts where user_id=$1 and contacts.id=$2', [userId,contactId]);
    if(isHavingContact.rows.length > 0) {
        const result = await pool.query('insert into notes (contact_id,content) values ($1,$2) returning notes.*',[contactId,content])

        return new NoteDto(result.rows[0]);
    }

    throw new AppError("Contact not found", 404);
}

export async function updateNote(userId:number,noteId:number,content:string){

    const isOwner = await pool.query('select notes.* from notes join contacts on contacts.id = notes.contact_id where contacts.user_id=$1 and notes.id = $2', [userId,noteId]);

    if(isOwner.rows.length > 0) {
        const result = await pool.query('UPDATE notes set content = ($1) where id = $2 returning notes.*',[content,noteId])
        return new NoteDto(result.rows[0]);
    }
    throw new AppError("Note not found", 404);
}

export async function deleteNote(userId:number,noteId:number){
    const result = await pool.query('delete from notes USING contacts where contacts.id = notes.contact_id and contacts.user_id=$1 and notes.id=$2 returning notes.*',[userId,noteId]);

    const row = result.rows[0];
    if (!row) throw new AppError("Note not found", 404);
    return new NoteDto(row);
}