import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users';
import tasksRouter from './routes/tasks';
import contactsRouter from "./routes/contacts";
import notesRouter from './routes/notes';
import authRouter from './routes/auth';
import { errorHandler } from "./middleware/errorHandler";
import './types/express';
import { setupSwagger } from './swagger';

const app = express();

app.set('trust proxy', 1);
app.use(express.json());
app.use(cookieParser());

// Dynamic CORS configuration for Vercel Preview & Production environments
const configuredOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3001')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const defaultAllowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  ...configuredOrigins,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman, server-side fetch)
      if (!origin) {
        return callback(null, true);
      }

      // Check explicit allowed origins or wildcard
      if (
        defaultAllowedOrigins.includes(origin) ||
        defaultAllowedOrigins.includes('*')
      ) {
        return callback(null, true);
      }

      // Automatically allow all Vercel Preview and Production deployments (*.vercel.app)
      if (/^https:\/\/.*\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }

      callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Nexus CRM REST API',
    version: '2.4.0',
    documentation: '/api-docs',
  });
});

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);
app.use('/contacts', contactsRouter);
app.use('/notes', notesRouter);

setupSwagger(app);

app.use(errorHandler);

export default app;