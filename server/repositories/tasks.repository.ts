import pool from '../db';

export async function findTasks(userId: number, offset: number, limit: number) {
    const result = await pool.query(
        "SELECT id, title, description, user_id, status, position, created_at FROM tasks where user_id = $1 order by id offset $2 limit $3",
        [userId, offset, limit]
    );
    return result.rows;
}

export async function findTaskById(id: number, userId: number) {
    const result = await pool.query(
        'select id, title, description, user_id, status, position, created_at from tasks where id = $1 and user_id = $2',
        [id, userId]
    );
    return result.rows[0];
}

export async function createTask(title: string, description: string, userId: number, status: string, position: number) {
    const result = await pool.query(
        'insert into tasks (title, description, user_id, status, position) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, description, user_id, status, position, created_at',
        [title, description, userId, status, position]
    );
    return result.rows[0];
}

export async function updateTask(id: number, userId: number, fields: { title: string, description: string, status: string, position?: number }) {
    const result = await pool.query(
        'UPDATE tasks SET title=$1, status=$2 ,description=$3, position=COALESCE($4, position)  WHERE id=$5 AND user_id=$6 RETURNING id, title, description, user_id, status, position, created_at',
        [fields.title, fields.status, fields.description, fields.position ?? null, id, userId]
    );
    return result.rows[0];
}

export async function deleteTask(id: number, userId: number) {
    const result = await pool.query(
        'delete from tasks where id=$1 and user_id=$2 RETURNING id, title, description, user_id, status, position, created_at',
        [id, userId]
    );
    return result.rows[0];
}
