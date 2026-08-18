import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const isCloudDb =
  process.env.DB_SSL === 'true' ||
  (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost'));

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: isCloudDb ? { rejectUnauthorized: false } : undefined,
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '1234',
        database: process.env.DB_NAME || 'mini-crm',
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
      }
);

export default pool;