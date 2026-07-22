import pool from '../db'
import {paginate} from "../utils/paginate";
import { AppError } from "../utils/AppError";

export async function getContacts(userId: number,pageInput: number, limitInput: number) {

    const paginationData = await paginate('contacts',pageInput,limitInput,'userId',userId)
    const {offset, limit, ...pagination} = paginationData
    const result = await pool.query(`select * from contacts where userId=$1 ORDER BY id asc offset $2 limit $3`,[userId,offset,limit])

    return {
        "data": result.rows,
        "pagination": pagination
    };
}

export async function getContactById(userId:number,id: number) {
    const result = await pool.query('select * from contacts where userId=$1 and id=$2',[userId,id]);
    const row = result.rows[0];
    if (!row) throw new AppError("Contact not found", 404);
    return row;
}
export async function createContact(userId : number,name:string,email:string,phone:string) {
    const result = await pool.query('insert into contacts (userId, name,email,phone) values ($1,$2,$3,$4) returning id,userId,name,email,phone',[userId, name,email,phone]);
    return result.rows[0];
}

export async function updateContact(userId:number,id:number,fields:{name:string,email:string,phone:string}) {
    const result = await pool.query('update contacts set name = $1,email = $2,phone=$3 where userId = $4 and id = $5 returning id,userId,name,email,phone',[fields.name,fields.email,fields.phone,userId,id,]);
    const row = result.rows[0];
    if (!row) throw new AppError("Contact not found", 404);
    return row;
}

export async function deleteContact(userId:number,id:number) {
    const result = await pool.query('delete from contacts where id=$1 and userId=$2 returning id,userId,name,email,phone',[id,userId]);
    const row = result.rows[0];
    if (!row) throw new AppError("Contact not found", 404);
    return row;
}