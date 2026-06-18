import pool from '../db';
import bcrypt from 'bcrypt';

export async function getAllUsers() {
  const result = await pool.query('SELECT id, email, name, created_at FROM users ORDER BY id');
  return result.rows;
}

export async  function getUserById(id: number) {
    const result = await pool.query('select id,email,created_at from users where id=$1', [id]);
    return result.rows[0] || null
}

export async function createUser(email:string,password:string,name:string) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const result = await pool.query('INSERT INTO USERS (email,hashed_password,name) VALUES ($1,$2,$3) RETURNING id,email,created_at',[email,hash,name]);
    return result.rows[0] || null;
}

export async function deleteUserById(id: number){
    const result = await pool.query('DELETE FROM users WHERE id=$1 returning id', [id]);
    return result.rows[0]||null;

}

