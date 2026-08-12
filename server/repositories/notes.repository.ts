import pool from '../db';

export async function findNotes(userId: number, offset: number, limit: number) {
    const result = await pool.query(
        'select notes.* from notes join contacts on contacts.id = notes.contact_id where contacts.user_id = $1 order by notes.id offset $2 limit $3',
        [userId, offset, limit]
    );
    return result.rows;
}

export async function findNoteById(userId: number, noteId: number) {
    const result = await pool.query(
        'select notes.* from notes join contacts on contacts.id = notes.contact_id where contacts.user_id = $1 and notes.id = $2',
        [userId, noteId]
    );
    return result.rows[0];
}

export async function createNote(userId: number, contactId: number, content: string) {
    const result = await pool.query(
        'insert into notes (contact_id,content) select $1, $2 where exists (select 1 from contacts where contacts.id = $1 and contacts.user_id = $3) returning notes.*',
        [contactId, content, userId]
    );
    return result.rows[0];
}

export async function updateNote(userId: number, noteId: number, content: string) {
    const result = await pool.query(
        'UPDATE notes SET content = $1 FROM contacts WHERE contacts.id = notes.contact_id AND contacts.user_id = $2 AND notes.id = $3 RETURNING notes.*',
        [content, userId, noteId]
    );
    return result.rows[0];
}

export async function deleteNote(userId: number, noteId: number) {
    const result = await pool.query(
        'delete from notes USING contacts where contacts.id = notes.contact_id and contacts.user_id=$1 and notes.id=$2 returning notes.*',
        [userId, noteId]
    );
    return result.rows[0];
}
