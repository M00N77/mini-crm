import pool from '../db'

export async function getContacts(userId: number) {
    const result = await pool.query('select * from contacts where user_id=$1 ',[userId])
    return result.rows;
}

export async function getContactById(userId:number,id: number) {
    const result = await pool.query('select * from contacts where user_id=$1 and id=$2',[userId,id]);
    return result.rows[0] || null;
}
export async function createContact(userId : number,name:string,email:string,phone:string) {
    const result = await pool.query('insert into contacts (user_id, name,email,phone) values ($1,$2,$3,$4) returning id,user_id,name,email,phone',[userId, name,email,phone]);
    return result.rows[0];
}

export async function updateContact(userId:number,id:number,fields:{name:string,email:string,phone:string}) {
    const result = await pool.query('update contacts set name = $1,email = $2,phone=$3 where user_id = $4 and id = $5 returning id,user_id,name,email,phone',[fields.name,fields.email,fields.phone,userId,id,]);
    return result.rows[0] || null;
}

export async function deleteContact(userId:number,id:number) {
    const result = await pool.query('delete from contacts where id=$1 and user_id=$2 returning id,user_id,name,email,phone',[id,userId]);
    return result.rows[0] || null;
}