import pool from "../db";

export async function getAllNotesById(userId:number){
    const result = await pool.query('select * from notes join contacts on contacts.id = notes.contact_id where contacts.user_id = $1',[userId]);

    return result.rows;
}

export async function getNoteById(userId:number,noteId: number){
    const result = await pool.query('select * from notes join contacts on contacts.id = notes.contact_id where contacts.user_id = $1 and notes.id = $2', [userId,noteId]);

    return result.rows[0] || null;
}

export async function createNote(userId:number,contactId:number,content:string){
    const isHavingContact = await pool.query('select * from contacts where user_id=$1 and contacts.id=$2', [userId,contactId]);
    if(isHavingContact.rows.length > 0) {
        const result = await pool.query('insert into notes (contact_id,content) values ($1,$2) RETURNING *',[contactId,content])

        return result.rows[0] || null;
    }

    return null
}

export async function updateNote(userId:number,noteId:number,content:string){

    const isOwner = await pool.query('select * from notes join contacts on contacts.id = notes.contact_id where user_id=$1 and notes.id = $2', [userId,noteId]);

    if(isOwner.rows.length > 0) {
        const result = await pool.query('UPDATE notes set content = ($1) where id = $2 returning *',[content,noteId])
        return result.rows[0] || null;
    }
    return null
}

export async function deleteNote(userId:number,noteId:number){
    const result = await pool.query('delete from notes USING contacts where contacts.id = notes.contact_id and contacts.user_id=$1 and notes.id=$2',[userId,noteId]);


    return result.rows[0] || null;
}