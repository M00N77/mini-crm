import pool from '../db';

export async function findUsers(offset: number, limit: number) {
    const result = await pool.query(
        'SELECT id, email, name, created_at FROM users ORDER BY id offset $1 limit $2',
        [offset, limit]
    );
    return result.rows;
}

export async function findUserById(id: number) {
    const result = await pool.query(
        "select id,email,name,created_at from users where id=$1",
        [id]
    );
    return result.rows[0];
}

export async function deleteUser(id: number) {
    const result = await pool.query(
        "DELETE FROM users WHERE id=$1 returning id",
        [id]
    );
    return result.rows[0];
}
