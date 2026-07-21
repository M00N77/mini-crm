import pool from "../db";
import {paginate} from "../utils/paginate";
import { AppError } from "../utils/AppError";


export async function getAllTasksByUserId(userId:number,pageInput:number,limitInput:number){
    const paginationData = await paginate('tasks',userId,'userId',pageInput,limitInput,)
    const {offset,limit} = paginationData
    const result = await pool.query("SELECT id, title, description, userId, status, createdAt FROM tasks where userId = $1 offset $2 limit $3",[userId,offset,limit]);
    return {
        "data": result.rows,
        "pagination": {...paginationData}
    }
}

export async function getTaskByIdAndUserId(id:number,userId:number){
    const result = await pool.query('select id, title, description, userId, status, createdAt from tasks where id = $1 and userId = $2', [id,userId]);
    const row = result.rows[0];
    if (!row) throw new AppError("Task not found", 404);
    return row;
}

export async function createTask(title:string,description:string,userId:number,status:string){

    const result = await pool.query('insert into tasks (title, description, userId, status) VALUES ($1, $2, $3, $4) RETURNING id, title, description, userId, status, createdAt', [title, description, userId, status]);
    return result.rows[0];
}

export async function updateTask(id:number,userId:number,fields:{title:string,description:string,status:string}){
    const result = await pool.query('UPDATE tasks SET title=$1, status=$2 ,description=$3  WHERE id=$4 AND userId=$5 RETURNING id, title, description, userId, status, createdAt', [fields.title, fields.status,fields.description, id, userId]);

    const row = result.rows[0];
    if (!row) throw new AppError("Task not found", 404);
    return row;
}

export async function deleteTask(id:number,userId:number){
    const result = await pool.query('delete from tasks where id=$1 and userId=$2 RETURNING id, title, description, userId, status, createdAt', [id,userId]);

    const row = result.rows[0];
    if (!row) throw new AppError("Task not found", 404);
    return row;
}