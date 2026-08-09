import 'dotenv/config';
import app from './app';
import pool from './db';

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}`);
  try {
    const result = await pool.query('SELECT NOW()');
    console.log("DB connected:", result.rows[0].now);
  } catch (err) {
    console.error("DB connection error:", err);
  }
});