import fs from "fs";
import path from "path";
import pool from "../db";

async function runMigrations() {
  console.log("🚀 Starting database migrations...");
  const migrationsDir = path.join(__dirname, "../db/migrations");

  if (!fs.existsSync(migrationsDir)) {
    console.log("No migrations directory found.");
    return;
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf-8");
    console.log(`Executing migration: ${file}...`);
    try {
      await pool.query(sql);
      console.log(`✅ Migration ${file} applied successfully.`);
    } catch (err: any) {
      console.error(`❌ Migration ${file} failed:`, err.message);
      process.exit(1);
    }
  }

  console.log("🎉 All migrations applied successfully.");
  await pool.end();
}

runMigrations().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
