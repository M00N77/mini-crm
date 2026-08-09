import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";
import pool, { ensureSchema, truncateAll } from "./helpers/db";

beforeAll(async () => {
  await ensureSchema();
});

beforeEach(async () => {
  await truncateAll();
});

afterAll(async () => {
  await pool.end();
});

describe("POST /auth/register", () => {
  it("should register a user and persist user + refresh token to DB", async () => {
    const payload = {
      email: "test@example.com",
      password: "password123",
      name: "Platon",
    };

    const res = await request(app).post("/auth/register").send(payload);

    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user).toMatchObject({ email: payload.email, name: payload.name });
    expect(res.body.refreshToken).toBeUndefined();

    const setCookie = res.headers["set-cookie"];
    expect(setCookie).toBeDefined();
    expect(setCookie[0]).toContain("token=");

    const dbUser = await pool.query("SELECT * FROM users WHERE email = $1", [
      payload.email,
    ]);
    expect(dbUser.rows.length).toBe(1);
    expect(dbUser.rows[0].name).toBe(payload.name);

    const dbToken = await pool.query(
      "SELECT * FROM refresh_tokens WHERE user_id = $1",
      [dbUser.rows[0].id],
    );
    expect(dbToken.rows.length).toBe(1);
  });

  it("should return 409 if email already exists", async () => {
    const payload = {
      email: "dup@example.com",
      password: "password123",
      name: "First",
    };

    await request(app).post("/auth/register").send(payload).expect(201);

    const res = await request(app)
      .post("/auth/register")
      .send({ ...payload, name: "Second" })
      .expect(409);

    expect(res.body.error).toBeDefined();
    const rows = await pool.query("SELECT * FROM users WHERE email = $1", [
      payload.email,
    ]);
    expect(rows.rows.length).toBe(1);
  });
});

describe("POST /auth/login", () => {
  it("should login and return 200 with access token", async () => {
    const payload = {
      email: "login@example.com",
      password: "password123",
      name: "Platon",
    };

    await request(app).post("/auth/register").send(payload).expect(201);

    const res = await request(app)
      .post("/auth/login")
      .send({ email: payload.email, password: payload.password })
      .expect(200);

    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe(payload.email);
  });

  it("should return 401 for wrong password", async () => {
    const payload = {
      email: "wrong@example.com",
      password: "password123",
      name: "Platon",
    };

    await request(app).post("/auth/register").send(payload).expect(201);

    const res = await request(app)
      .post("/auth/login")
      .send({ email: payload.email, password: "wrongpass" })
      .expect(401);

    expect(res.body.error).toBeDefined();
  });
});

describe("POST /auth/refresh", () => {
  it("should rotate tokens and return 200 with new access token", async () => {
    const payload = {
      email: "refresh@example.com",
      password: "password123",
      name: "Platon",
    };

    const reg = await request(app).post("/auth/register").send(payload).expect(201);
    const cookie = reg.headers["set-cookie"][0].split(";")[0];

    const res = await request(app)
      .post("/auth/refresh")
      .set("Cookie", cookie)
      .expect(200);

    expect(res.body.accessToken).toBeDefined();

    const dbUser = await pool.query("SELECT id FROM users WHERE email = $1", [
      payload.email,
    ]);
    const tokens = await pool.query(
      "SELECT * FROM refresh_tokens WHERE user_id = $1",
      [dbUser.rows[0].id],
    );
    expect(tokens.rows.length).toBe(2);
    expect(tokens.rows.filter((r: any) => r.revoked_at !== null).length).toBe(
      1,
    );
    expect(tokens.rows.filter((r: any) => r.revoked_at === null).length).toBe(
      1,
    );
  });

  it("should return 401 for invalid refresh token", async () => {
    const res = await request(app)
      .post("/auth/refresh")
      .set("Cookie", "token=invalid-token")
      .expect(401);

    expect(res.body.error).toBeDefined();
  });
});