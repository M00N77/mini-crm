import { PoolClient } from "pg";

export async function findRefresh(
  client: PoolClient,
  userId: number,
  jti: string,
) {
  const result = await client.query(
    "select user_id, jti, token_hash, revoked_at, expires_at from refresh_tokens where user_id=$1 and jti=$2 for update",
    [userId, jti],
  );
  return result.rows[0];
}

export async function emailTaken(client: PoolClient, email: string) {
  const user = await client.query("select id, email, name, hashed_password, created_at from users where email=$1", [
    email,
  ]);
  return user.rows[0];
}