import pool from '../db'
import {paginate} from "../utils/paginate";
import { AppError } from "../utils/AppError";
import { ContactDto } from "../mappers/contact.mapper";

export async function getContacts(userId: number,pageInput: number, limitInput: number) {

    const paginationData = await paginate('contacts',pageInput,limitInput,'user_id',userId)
    const {offset, limit, ...pagination} = paginationData
    const result = await pool.query(`select * from contacts where user_id=$1 ORDER BY id asc offset $2 limit $3`,[userId,offset,limit])

    return {
        "data": result.rows.map((row) => new ContactDto(row)),
        "pagination": pagination
    };
}

export async function getContactById(userId:number,id: number) {
    const result = await pool.query('select * from contacts where user_id=$1 and id=$2',[userId,id]);
    const row = result.rows[0];
    if (!row) throw new AppError("Contact not found", 404);
    return new ContactDto(row);
}
export async function createContact(userId : number,name:string,email:string,company:string,jobPosition:string,phone:string) {
    const result = await pool.query('insert into contacts (user_id, name,email,company,job_position,phone) values ($1,$2,$3,$4,$5,$6) returning id,user_id,name,email,company,job_position,phone',[userId, name,email,company,jobPosition,phone]);
    return new ContactDto(result.rows[0]);
}

export async function updateContact(userId:number,id:number,fields:{name:string,email:string,company:string,jobPosition:string,phone:string}) {
    const result = await pool.query('update contacts set name = $1,email = $2,company = $3,job_position = $4,phone=$5 where user_id = $6 and id = $7 returning id,user_id,name,email,company,job_position,phone',[fields.name,fields.email,fields.company,fields.jobPosition,fields.phone,userId,id]);
    const row = result.rows[0];
    if (!row) throw new AppError("Contact not found", 404);
    return new ContactDto(row);
}

export async function deleteContact(userId:number,id:number) {
    const result = await pool.query('delete from contacts where id=$1 and user_id=$2 returning id,user_id,name,email,company,job_position,phone',[id,userId]);
    const row = result.rows[0];
    if (!row) throw new AppError("Contact not found", 404);
    return new ContactDto(row);
}