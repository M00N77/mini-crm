import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";
import cookieParser from "cookie-parser";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import authRouter from "../server/routes/auth";
import contactsRouter from "../server/routes/contacts";
import { errorHandler } from "../server/middleware/errorHandler";

const { mPool, PoolMock } = vi.hoisted(() => {
  const mPool: any = { query: vi.fn(), connect: vi.fn(), release: vi.fn() };
  mPool.connect.mockImplementation(function () {
    return mPool;
  });
  return {
    mPool,
    PoolMock: vi.fn(function () {
      return mPool;
    }),
  };
});

vi.mock("pg", () => ({ Pool: PoolMock }));

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/contacts", contactsRouter);
app.use(errorHandler);

const fakeUser = {
  id: 1,
  email: "test@mail.ru",
  name: "Test User",
  created_at: new Date().toISOString(),
};

function mockDefault(result: unknown) {
  vi.mocked(mPool.query).mockResolvedValue(result as never);
}

class PgError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(mPool.query).mockReset();
  vi.mocked(mPool.connect).mockImplementation(() => mPool);
});

describe("POST /auth/register", () => {
  it("should register a new user and return 201 with tokens", async () => {
    mockDefault({ rows: [fakeUser], rowCount: 1 });

    const res = await request(app)
      .post("/auth/register")
      .send({ email: "test@mail.ru", password: "123456", name: "Test User" })
      .expect(201);

    expect(res.body.user).toMatchObject({ id: 1, email: "test@mail.ru" });
    expect(res.body.accessToken).toBeDefined();
  });

  it("should return 409 if email already exists", async () => {
    vi.mocked(mPool.query)
      .mockResolvedValueOnce({ rows: [], rowCount: 0 })
      .mockRejectedValueOnce(new PgError("23505", "duplicate key"))
      .mockResolvedValueOnce({ rows: [], rowCount: 0 });

    const res = await request(app)
      .post("/auth/register")
      .send({ email: "test@mail.ru", password: "123456", name: "Test" })
      .expect(409);

    expect(res.body.error).toBeDefined();
  });
});

describe("POST /auth/login", () => {
  const hashedPassword = bcrypt.hashSync("123456", bcrypt.genSaltSync(10));

  it("should login and return 200 with tokens", async () => {
    mockDefault({
      rows: [{ id: 1, email: "test@mail.ru", hashed_password: hashedPassword }],
      rowCount: 1,
    });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@mail.ru", password: "123456" })
      .expect(200);

    expect(res.body.user).toBeDefined();
    expect(res.body.accessToken).toBeDefined();
  });

  it("should return 401 for wrong password", async () => {
    mockDefault({
      rows: [{ id: 1, email: "test@mail.ru", hashed_password: hashedPassword }],
      rowCount: 1,
    });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@mail.ru", password: "wrong1" })
      .expect(401);

    expect(res.body.error).toBeDefined();
  });

  it("should return 401 for non-existent user", async () => {
    mockDefault({ rows: [], rowCount: 0 });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "noone@mail.ru", password: "123456" })
      .expect(401);

    expect(res.body.error).toBeDefined();
  });
});

describe("POST /auth/refresh", () => {
  it("should rotate tokens and return 200", async () => {
    const payload = { userId: 1, email: "test@mail.ru" };
    const refreshToken = jwt.sign(
      { ...payload, jti: "test-jti" },
      "test-secret",
      { expiresIn: "7d" },
    );
    const hashedToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    mockSequence(
      { rows: [], rowCount: 0 }, // begin
      {
        rows: [
          {
            user_id: 1,
            jti: "test-jti",
            token_hash: hashedToken,
            revoked_at: null,
          },
        ],
        rowCount: 1,
      }, // findRefresh
      { rows: [], rowCount: 0 }, // revoke old token
      {
        rows: [{ id: 1, user_id: 1, expires_at: new Date(), jti: "new-jti" }],
        rowCount: 1,
      }, // insert new token
    );

    const res = await request(app)
      .post("/auth/refresh")
      .set("Cookie", "token=" + refreshToken)
      .expect(200);

    expect(res.body.accessToken).toBeDefined();
  });

  it("should return 401 for invalid refresh token", async () => {
    const res = await request(app)
      .post("/auth/refresh")
      .set("Cookie", "token=invalid-token")
      .expect(401);

    expect(res.body.error).toBeDefined();
  });
});

function mockSequence(...results: unknown[]) {
  let i = 0;
  vi.mocked(mPool.query).mockImplementation(() =>
    Promise.resolve(results[i++] as never),
  );
}

describe("Protected routes (GET /contacts)", () => {
  it("should return 401 without token", async () => {
    const res = await request(app).get("/contacts").expect(401);

    expect(res.body.message).toBe("Invalid session");
  });

  it("should return 200 with valid token", async () => {
    const token = jwt.sign(
      { userId: 1, email: "test@mail.ru" },
      "test-secret",
      { expiresIn: "15m" },
    );

    mockSequence(
      { rows: [], rowCount: 0 },
      { rows: [{ count: "0" }] },
      { rows: [], rowCount: 0 },
      { rows: [], rowCount: 0 },
    );

    const res = await request(app)
      .get("/contacts")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body).toBeDefined();
  });
});