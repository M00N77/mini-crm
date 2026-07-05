process.env.JWT_SECRET = 'test-secret';

jest.mock('pg', () => {
  const mPool = { query: jest.fn() };
  return { Pool: jest.fn(() => mPool) };
});

import request from 'supertest';
import cookieParser from 'cookie-parser';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import authRouter from '../server/routes/auth';
import contactsRouter from '../server/routes/contacts';
import { errorHandler } from '../server/middleware/errorHandler';

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use('/auth', authRouter);
app.use('/contacts', contactsRouter);
app.use(errorHandler);

const mPool = new (jest.requireMock('pg').Pool)();

const fakeUser = {
  id: 1,
  email: 'test@mail.ru',
  name: 'Test User',
  created_at: new Date().toISOString(),
};

function mockDefault(result: unknown) {
  (mPool.query as jest.Mock).mockResolvedValue(result);
}

class PgError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

beforeEach(() => {
  jest.clearAllMocks();
  (mPool.query as jest.Mock).mockReset();
});

describe('POST /auth/register', () => {
  it('should register a new user and return 201 with tokens', async () => {
    mockDefault({ rows: [fakeUser], rowCount: 1 });

    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'test@mail.ru', password: '123456', name: 'Test User' })
      .expect(201);

    expect(res.body.user).toMatchObject({ id: 1, email: 'test@mail.ru' });
    expect(res.body.accessToken).toBeDefined();
  });

  it('should return 409 if email already exists', async () => {
    (mPool.query as jest.Mock).mockRejectedValue(new PgError('23505', 'duplicate key'));

    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'test@mail.ru', password: '123456', name: 'Test' })
      .expect(409);

    expect(res.body.error).toBeDefined();
  });
});

describe('POST /auth/login', () => {
  const hashedPassword = bcrypt.hashSync('123456', bcrypt.genSaltSync(10));

  it('should login and return 200 with tokens', async () => {
    mockDefault({
      rows: [{ id: 1, email: 'test@mail.ru', hashed_password: hashedPassword }],
      rowCount: 1,
    });

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@mail.ru', password: '123456' })
      .expect(200);

    expect(res.body.user).toBeDefined();
    expect(res.body.accessToken).toBeDefined();
  });

  it('should return 401 for wrong password', async () => {
    mockDefault({
      rows: [{ id: 1, email: 'test@mail.ru', hashed_password: hashedPassword }],
      rowCount: 1,
    });

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@mail.ru', password: 'wrong' })
      .expect(401);

    expect(res.body.error).toBeDefined();
  });

  it('should return 401 for non-existent user', async () => {
    mockDefault({ rows: [], rowCount: 0 });

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'noone@mail.ru', password: '123456' })
      .expect(401);

    expect(res.body.error).toBeDefined();
  });
});

describe('POST /auth/refresh', () => {
  it('should rotate tokens and return 200', async () => {
    const payload = { userId: 1, email: 'test@mail.ru' };
    const refreshToken = jwt.sign({ ...payload, jti: 'test-jti' }, 'test-secret', { expiresIn: '7d' });
    const hashedToken = require('crypto').createHash('sha256').update(refreshToken).digest('hex');

    (mPool.query as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve({ rows: [{ user_id: 1, jti: 'test-jti', token_hash: hashedToken }], rowCount: 1 }))
      .mockImplementationOnce(() => Promise.resolve({ rows: [], rowCount: 0 }))
      .mockImplementationOnce(() => Promise.resolve({ rows: [{ id: 1, user_id: 1, token_hash: 'new', expires_at: new Date(), jti: 'new-jti' }], rowCount: 1 }));

    const res = await request(app)
      .post('/auth/refresh')
      .set('Cookie', 'token=' + refreshToken)
      .expect(200);

    expect(res.body.accessToken).toBeDefined();
  });

  it('should return 401 for invalid refresh token', async () => {
    const res = await request(app)
      .post('/auth/refresh')
      .set('Cookie', 'token=invalid-token')
      .expect(401);

    expect(res.body.error).toBeDefined();
  });
});

describe('Protected routes (GET /contacts)', () => {
  it('should return 401 without token', async () => {
    const res = await request(app)
      .get('/contacts')
      .expect(401);

    expect(res.body.error).toBe('No token provided');
  });

  it('should return 200 with valid token', async () => {
    const token = jwt.sign({ userId: 1, email: 'test@mail.ru' }, 'test-secret', { expiresIn: '15m' });

    (mPool.query as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve({ rows: [{ count: '0' }] }))
      .mockImplementationOnce(() => Promise.resolve({ rows: [], rowCount: 0 }));

    const res = await request(app)
      .get('/contacts')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toBeDefined();
  });
});
