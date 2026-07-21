import bcrypt from "bcrypt";
import pool from "../db";
import { AppError } from "../utils/AppError";
import { paginate } from "../utils/paginate";

export async function getUsers() {
  const paginateData = await paginate("users");
  const { offset, limit, ...pagination } = paginateData;
  const result = await pool.query(
    "SELECT id, email, name, createdAt FROM users ORDER BY id offset $1 limit $2 ",
    [offset, limit],
  );
  return {
    data: result.rows,
    pagination,
  };
}

export async function getUserById(id: number) {
  const result = await pool.query(
    "select id,email,name,createdAt from users where id=$1",
    [id],
  );
  const row = result.rows[0];
  if (!row) throw new AppError("User not found", 404);
  return row;
}

export async function createUser(
  email: string,
  password: string,
  name: string,
) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const result = await pool.query(
    "INSERT INTO USERS (email,hashedPassword,name) VALUES ($1,$2,$3) RETURNING id,email,createdAt",
    [email, hash, name],
  );
  return result.rows[0];
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
    "select id,name,email,createdAt from users where id = $1",
    [userId],
  );
  if (data.rows.length === 0) throw new AppError("User not found", 404);

  return data.rows[0];
}
