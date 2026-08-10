import pool from "../db";
import { AppError } from "../utils/AppError";
import { paginate } from "../utils/paginate";
import { UserDto } from "../mappers/auth.mapper";

export async function getUsers(userId: number, pageInput:number,limitInput:number,) {
  const paginateData = await paginate('users',pageInput,limitInput,'id',userId);
  const { offset, limit, ...pagination } = paginateData;
  const result = await pool.query(
    'SELECT id, email, name, created_at FROM users WHERE id = $3 ORDER BY id offset $1 limit $2',
    [offset, limit, userId],
  );
  return {
    data: result.rows.map((row) => new UserDto(row)),
    pagination,
  };
}

export async function getUserById(id: number) {
  const result = await pool.query(
    "select id,email,name,created_at from users where id=$1",
    [id],
  );
  const row = result.rows[0];
  if (!row) throw new AppError("User not found", 404);
  return new UserDto(row);
}

export async function deleteUser(id: number) {
  const result = await pool.query(
    "DELETE FROM users WHERE id=$1 returning id",
    [id],
  );
  const row = result.rows[0];
  if (!row) throw new AppError("User not found", 404);
  return row;
}

export async function getUserInfo(userId: number) {
  const data = await pool.query(
    "select id,name,email,created_at from users where id = $1",
    [userId],
  );
  if (data.rows.length === 0) throw new AppError("User not found", 404);

  return new UserDto(data.rows[0]);
}
