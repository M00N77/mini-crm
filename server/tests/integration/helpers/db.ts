import fs from "fs";
import path from "path";
import pool from "../../../db";

const TABLES = [
  "notes",
  "refresh_tokens",
  "contacts",
  "tasks",
  "users",
];

export async function ensureSchema() {
  const sqlPath = path.resolve(__dirname, "../../../db/init.sql");
  const dropPath = path.resolve(__dirname, "../../../db/drop_tables.sql");
  const drop = fs.readFileSync(dropPath, "utf-8");
  const sql = fs.readFileSync(sqlPath, "utf-8");
  await pool.query(drop);
  await pool.query(sql);
}

export async function truncateAll() {
  await pool.query(`TRUNCATE TABLE ${TABLES.join(", ")} CASCADE`);
}

export default pool;