import pool from "../db";
import {paginate} from "../utils/paginate";
import { resolveSort } from "../utils/sort";
import { AppError } from "../utils/AppError";
import { TaskDto } from "../mappers/task.mapper";
import { TaskStatus } from "../schemas/tasks.schema";

const TASK_SORT: Record<string, string> = {
  title: "title",
  status: "status",
  position: "position",
  createdAt: "created_at",
};

export async function getTasks(userId:number,pageInput:number,limitInput:number,sortBy?:string,order?:string){
    const { orderBy, orderDir } = resolveSort(sortBy, order, TASK_SORT, { orderBy: "id", orderDir: "ASC" });
    const { rows, pagination: paginationData } = await paginate({
        fromClause: 'tasks',
        columns: 'id, title, description, user_id, status, position, created_at',
        userIdColumn: 'user_id',
        userId,
        orderBy,
        orderDir,
        pageInput,
        limitInput,
    });
    const { offset, limit, ...pagination } = paginationData
    return {
        "data": rows.map((row) => new TaskDto(row)),
        "pagination": pagination
    }
}

export async function getTaskById(id:number,userId:number){
    const result = await pool.query('select id, title, description, user_id, status, position, created_at from tasks where id = $1 and user_id = $2', [id,userId]);
    const row = result.rows[0];
    if (!row) throw new AppError("Task not found", 404);
    return new TaskDto(row);
}

export async function createTask(title:string,description:string,userId:number,status:string,position:number=0){

    const result = await pool.query('insert into tasks (title, description, user_id, status, position) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, description, user_id, status, position, created_at', [title, description, userId, status, position]);
    return new TaskDto(result.rows[0]);
}

export async function updateTask(id:number,userId:number,fields:{title:string,description:string,status:TaskStatus,position:number}){
    const result = await pool.query('UPDATE tasks SET title=$1, status=$2 ,description=$3, position=$4 WHERE id=$5 AND user_id=$6 RETURNING id, title, description, user_id, status, position, created_at', [fields.title, fields.status, fields.description, fields.position, id, userId]);

    const row = result.rows[0];
    if (!row) throw new AppError("Task not found", 404);
    return new TaskDto(row);
}

export async function patchTask(id:number,userId:number,fields:{title?:string,description?:string,status?:TaskStatus,position?:number}){
    const allowed: Record<string, string> = {
        title: "title",
        description: "description",
        status: "status",
        position: "position",
    };
    const keys = Object.keys(fields).filter(
        (k) => allowed[k] && fields[k as keyof typeof fields] !== undefined,
    );
    if (keys.length === 0) throw new AppError("Nothing to update", 400);

    const setClause = keys.map((k, i) => `${allowed[k]} = $${i + 1}`).join(", ");
    const values = keys.map((k) => fields[k as keyof typeof fields]);
    const result = await pool.query(
        `UPDATE tasks SET ${setClause} WHERE id = $${keys.length + 1} AND user_id = $${keys.length + 2} RETURNING id, title, description, user_id, status, position, created_at`,
        [...values, id, userId],
    );

    const row = result.rows[0];
    if (!row) throw new AppError("Task not found", 404);
    return new TaskDto(row);
}

export async function deleteTask(id:number,userId:number){
    const result = await pool.query('delete from tasks where id=$1 and user_id=$2 RETURNING id, title, description, user_id, status, position, created_at', [id,userId]);

    const row = result.rows[0];
    if (!row) throw new AppError("Task not found", 404);
    return new TaskDto(row);
}