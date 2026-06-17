import pool from "../db";


export async function getAllTasksByUserId(userId:number){
    const result = await pool.query("SELECT id, title, description, user_id AS \"userId\", status, created_at AS \"createdAt\" FROM tasks where user_id = $1",[userId]);
    return result.rows
}

export async function getTaskByIdAndUserId(id:number,userId:number){
    const result = await pool.query('select id, title, description, user_id AS "userId", status, created_at AS "createdAt" from tasks where id = $1 and user_id = $2', [id,userId]);
    return result.rows[0] || null;
}

export async function createTask(title:string,description:string,userId:number,status:string){

    const result = await pool.query('insert into tasks (title, description, user_id, status) VALUES ($1, $2, $3, $4) RETURNING id, title, description, user_id AS "userId", status, created_at AS "createdAt"', [title, description, userId, status]);
    return result.rows[0] || null;
}

export async function updateTask(id:number,userId:number,fields:{title:string,description:string,status:string}){
    const result = await pool.query('UPDATE tasks SET title=$1, status=$2 ,description=$3  WHERE id=$4 AND user_id=$5 RETURNING id, title, description, user_id AS "userId", status, created_at AS "createdAt"', [fields.title, fields.status,fields.description, id, userId]);

    return result.rows[0] || null;
}

export async function deleteTask(id:number,userId:number){
    const result = await pool.query('delete from tasks where id=$1 and user_id=$2 RETURNING id, title, description, user_id AS "userId", status, created_at AS "createdAt"', [id,userId]);

    return result.rows[0] || null;
}