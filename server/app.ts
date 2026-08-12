import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors'
import usersRouter from './routes/users';
import tasksRouter from './routes/tasks';
import contactsRouter from "./routes/contacts";
import notesRouter from './routes/notes';
import authRouter from './routes/auth';
import {errorHandler} from "./middleware/errorHandler";
import './types/express';
import { setupSwagger } from './swagger';

const app = express();

app.set('trust proxy', 1);
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true,
}))

app.use('/auth', authRouter)
app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);
app.use('/contacts', contactsRouter)
app.use('/notes', notesRouter)

setupSwagger(app);

app.use(errorHandler);

export default app;