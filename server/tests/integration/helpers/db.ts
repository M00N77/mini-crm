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
  const sql = fs.readFileSync(sqlPath, "utf-8");
  await pool.query(sql);
}

export async function truncateAll() {
  await pool.query(`TRUNCATE TABLE ${TABLES.join(", ")} CASCADE`);
}

export default pool;