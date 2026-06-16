import pool from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-prod';

export async function login(email: string, password: string) {
  const result = await pool.query(
    'SELECT id, email, hashed_password FROM users WHERE email = $1',
    [email]
  );
  const user = result.rows[0];
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.hashed_password);
  if (!valid) return null;

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '24h',
  });

  return { token, user: { id: user.id, email: user.email } };
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; email: string };
  } catch {
    return null;
  }
}
