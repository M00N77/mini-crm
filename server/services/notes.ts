import pool from "../db";
import {paginate} from "../utils/paginate";
import { resolveSort } from "../utils/sort";
import { AppError } from "../utils/AppError";
import { NoteDto } from "../mappers/note.mapper";

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
    const result = await pool.query('select notes.* from notes join contacts on contacts.id = notes.contact_id where contacts.user_id = $1 and notes.id = $2', [userId,noteId]);

    const row = result.rows[0];
    if (!row) throw new AppError("Note not found", 404);
    return new NoteDto(row);
}

export async function createNote(userId:number,contactId:number,content:string){
    const result = await pool.query(
        'insert into notes (contact_id,content) select $1, $2 where exists (select 1 from contacts where contacts.id = $1 and contacts.user_id = $3) returning notes.*',
        [contactId, content, userId],
    );

    const row = result.rows[0];
    if (!row) throw new AppError("Contact not found", 404);
    return new NoteDto(row);
}

export async function updateNote(userId:number,noteId:number,content:string){
    const result = await pool.query(
        'update notes set content = $1 from contacts where notes.id = $2 and notes.contact_id = contacts.id and contacts.user_id = $3 returning notes.*',
        [content, noteId, userId],
    );

    const row = result.rows[0];
    if (!row) throw new AppError("Note not found", 404);
    return new NoteDto(row);
}

export async function deleteNote(userId:number,noteId:number){
    const result = await pool.query('delete from notes USING contacts where contacts.id = notes.contact_id and contacts.user_id=$1 and notes.id=$2 returning notes.*',[userId,noteId]);

    const row = result.rows[0];
    if (!row) throw new AppError("Note not found", 404);
    return new NoteDto(row);
}