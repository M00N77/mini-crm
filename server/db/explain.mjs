import pg from 'pg';
import { readFileSync } from 'fs';

const pool = new pg.Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'mini-crm',
});

const queries = [
    ["tasks WHERE userId = 1", "EXPLAIN ANALYZE SELECT * FROM tasks WHERE userId = $1", [1]],
    ["contacts WHERE userId = 1", "EXPLAIN ANALYZE SELECT * FROM contacts WHERE userId = $1", [1]],
    ["notes WHERE contactId = 1", "EXPLAIN ANALYZE SELECT * FROM notes WHERE contactId = $1", [1]],
    ["refresh_tokens WHERE userId = 1", "EXPLAIN ANALYZE SELECT * FROM refresh_tokens WHERE userId = $1", [1]],
];

try {
    for (const [label, sql, params] of queries) {
        console.log(`--- ${label} ---`);
        const res = await pool.query(sql, params);
        for (const row of res.rows) {
            console.log(row['QUERY PLAN']);
        }
        console.log();
    }
} finally {
    await pool.end();
}
