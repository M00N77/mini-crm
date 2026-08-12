import {paginate} from "../utils/paginate";
import { AppError } from "../utils/AppError";
import { TaskDto } from "../mappers/task.mapper";
import * as tasksRepository from '../repositories/tasks.repository';

export async function getTasks(userId:number,pageInput:number,limitInput:number){
    const paginationData = await paginate('tasks',pageInput,limitInput,'user_id',userId)
    const {offset, limit, ...pagination} = paginationData
    const rows = await tasksRepository.findTasks(userId, offset, limit);
    return {
        "data": rows.map((row: any) => new TaskDto(row)),
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

export async function updateTask(id:number,userId:number,fields:{title:string,description:string,status:string,position?:number}){
    const row = await tasksRepository.updateTask(id, userId, fields);
    if (!row) throw new AppError("Task not found", 404);
    return new TaskDto(row);
}

export async function deleteTask(id:number,userId:number){
    const row = await tasksRepository.deleteTask(id, userId);
    if (!row) throw new AppError("Task not found", 404);
    return new TaskDto(row);
}