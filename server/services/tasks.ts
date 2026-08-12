import {paginate} from "../utils/paginate";
import { resolveSort } from "../utils/sort";
import { AppError } from "../utils/AppError";
import { TaskDto } from "../mappers/task.mapper";
import { TaskStatus } from "../schemas/tasks.schema";
import * as tasksRepository from '../repositories/tasks.repository';

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
    const row = await tasksRepository.findTaskById(id, userId);
    if (!row) throw new AppError("Task not found", 404);
    return new TaskDto(row);
}

export async function createTask(title:string,description:string,userId:number,status:string,position:number=0){
    const row = await tasksRepository.createTask(title, description, userId, status, position);
    return new TaskDto(row);
}

export async function updateTask(id:number,userId:number,fields:{title:string,description:string,status:TaskStatus,position:number}){
    const row = await tasksRepository.updateTask(id, userId, fields);
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
    
    import pool from "../db";
    const result = await pool.query(
        `UPDATE tasks SET ${setClause} WHERE id = $${keys.length + 1} AND user_id = $${keys.length + 2} RETURNING id, title, description, user_id, status, position, created_at`,
        [...values, id, userId],
    );

    const row = result.rows[0];
    if (!row) throw new AppError("Task not found", 404);
    return new TaskDto(row);
}

export async function deleteTask(id:number,userId:number){
    const row = await tasksRepository.deleteTask(id, userId);
    if (!row) throw new AppError("Task not found", 404);
    return new TaskDto(row);
}