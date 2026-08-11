import pool from "../db";
import { AppError } from "../utils/AppError";
import { paginate } from "../utils/paginate";
import { UserDto } from "../mappers/auth.mapper";

export async function getUsers(userId: number, pageInput:number,limitInput:number,) {
  const { rows, pagination: paginationData } = await paginate({
    fromClause: 'users',
    columns: 'id, email, name, created_at',
    userIdColumn: 'id',
    userId,
    orderBy: 'id',
    pageInput,
    limitInput,
  });
  const { offset, limit, ...pagination } = paginationData;
  return {
    data: rows.map((row) => new UserDto(row)),
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
