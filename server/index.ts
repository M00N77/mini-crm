import 'dotenv/config';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors'
import pool from './db';
// import { rateLimit } from 'express-rate-limit';
import usersRouter from './routes/users';
import tasksRouter from './routes/tasks';
import contactsRouter from "./routes/contacts";
import notesRouter from './routes/notes';
import authRouter from './routes/auth';
import {errorHandler} from "./middleware/errorHandler";
import './types/express';

const app = express();
const PORT = process.env.PORT || 3000;

// const globalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: 'Слишком много запросов. Пожалуйста, попробуйте позже.',
//   standardHeaders: true,
//   legacyHeaders: false,
// });



app.set('trust proxy', 1);
// app.use(globalLimiter);
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3001', credentials: true }))

app.use('/auth',authRouter)
app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);
app.use('/contacts',contactsRouter)
app.use('/notes',notesRouter)

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}`);
  try {
    const result = await pool.query('SELECT NOW()');
    console.log("DB connected:", result.rows[0].now);
  } catch (err) {
    console.error("DB connection error:", err);
  }
});


