import pool from "../db";
import bcrypt from "bcrypt";
import { AppError } from "../utils/AppError";
import { paginate } from "../utils/paginate";

export async function getAllUsers() {
  const paginateData = await paginate("users");
  const { offset, limit } = paginateData;
  const result = await pool.query(
    "SELECT id, email, name, created_at FROM users  offset $1 limit $2 ORDER BY id",
    [offset, limit],
  );
  return {
    data: result.rows,
    pagination: { ...paginateData },
  };
}

export async function getUserById(id: number) {
  const result = await pool.query(
    "select id,email,created_at from users where id=$1",
    [id],
  );
  return result.rows[0] || null;
}

export async function createUser(
  email: string,
  password: string,
  name: string,
) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const result = await pool.query(
    "INSERT INTO USERS (email,hashed_password,name) VALUES ($1,$2,$3) RETURNING id,email,created_at",
    [email, hash, name],
  );
  return result.rows[0];
}

export async function deleteUserById(id: number) {
  const result = await pool.query(
    "DELETE FROM users WHERE id=$1 returning id",
    [id],
  );
  return result.rows[0] || null;
}

export async function getUserInfo(userId: number) {
  const data = await pool.query(
    "select id,name,email,created_at from users where id = $1",
    [userId],
  );
  if (data.rows.length === 0) throw new AppError("User not found", 404);

  return data.rows[0];
}
