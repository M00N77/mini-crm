import express from 'express';
import pool from './db';
import usersRouter from './routes/users';
import tasksRouter from './routes/tasks';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);

app.listen(PORT, async () => {
  console.log("Server started on port 3000");
  try {
    const result = await pool.query('SELECT NOW()');
    console.log("DB connected:", result.rows[0].now);
  } catch (err) {
    console.error("DB connection error:", err);
  }
});