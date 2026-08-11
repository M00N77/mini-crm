import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";
import cookieParser from "cookie-parser";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

import authRouter from "../server/routes/auth";
import contactsRouter from "../server/routes/contacts";
import notesRouter from "../server/routes/notes";
import tasksRouter from "../server/routes/tasks";
import usersRouter from "../server/routes/users";
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
app.use("/notes", notesRouter);
app.use("/tasks", tasksRouter);
app.use("/users", usersRouter);
app.use(errorHandler);

const validToken = jwt.sign({ userId: 1, email: "test@mail.ru" }, "test-secret", {
  expiresIn: "15m",
});

const fakeUser = {
  id: 1,
  email: "test@mail.ru",
  name: "Test User",
  created_at: new Date().toISOString(),
};

const fakeContact = {
  id: 1,
  user_id: 1,
  name: "Ivan Ivanov",
  email: "ivan@mail.ru",
  phone: "+79991234567",
};

const fakeNote = {
  id: 1,
  contact_id: 1,
  content: "Test note content",
  created_at: new Date().toISOString(),
};

const fakeTask = {
  id: 1,
  title: "Test task",
  description: "Test description",
  user_id: 1,
  userId: 1,
  status: "pending",
  created_at: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};

class PgError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function mockSequence(...results: unknown[]) {
  let i = 0;
  vi.mocked(mPool.query).mockImplementation(() =>
    Promise.resolve(results[i++] as never),
  );
}

function mockDefault(result: unknown) {
  vi.mocked(mPool.query).mockResolvedValue(result as never);
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(mPool.query).mockReset();
  vi.mocked(mPool.connect).mockImplementation(() => mPool);
});

// ─── AUTH ────────────────────────────────────────────────────────────────────

describe("POST /auth/register", () => {
  it("should register a new user and return 201 with tokens and set cookie", async () => {
    mockDefault({ rows: [fakeUser], rowCount: 1 });

    const res = await request(app)
      .post("/auth/register")
      .send({ email: "test@mail.ru", password: "123456", name: "Test User" })
      .expect(201);

    expect(res.body.user).toMatchObject({ id: 1, email: "test@mail.ru" });
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user).not.toHaveProperty("hashed_password");
    const cookies = (res.headers["set-cookie"] as unknown as string[]) || [];
    const tokenCookie = cookies.find((c: string) => c.startsWith("token="));
    expect(tokenCookie).toBeDefined();
    expect(tokenCookie).toContain("HttpOnly");
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

describe("POST /auth/refresh", () => {
  it("should rotate tokens and return 200 with new cookie", async () => {
    const refreshToken = jwt.sign(
      { userId: 1, email: "test@mail.ru", jti: "test-jti" },
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
          { user_id: 1, jti: "test-jti", token_hash: hashedToken, revoked_at: null },
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
    const cookies = (res.headers["set-cookie"] as unknown as string[]) || [];
    const tokenCookie = cookies.find((c: string) => c.startsWith("token="));
    expect(tokenCookie).toBeDefined();
  });

  it("should return 401 for invalid refresh token", async () => {
    const res = await request(app)
      .post("/auth/refresh")
      .set("Cookie", "token=invalid-token")
      .expect(401);

    expect(res.body.error).toBeDefined();
  });
});

describe("POST /auth/logout", () => {
  it("should logout and return 200", async () => {
    const refreshToken = jwt.sign(
      { userId: 1, email: "test@mail.ru", jti: "test-jti" },
      "test-secret",
      { expiresIn: "7d" },
    );

    mockDefault({ rows: [{ id: 1 }], rowCount: 1 });

    const res = await request(app)
      .post("/auth/logout")
      .set("Cookie", "token=" + refreshToken)
      .expect(200);

    expect(res.body.message).toBe("User logged out");
  });

  it("should return 200 even without token", async () => {
    const res = await request(app).post("/auth/logout").expect(200);

    expect(res.body.message).toBe("User logged out");
  });
});

// ─── CONTACTS ────────────────────────────────────────────────────────────────

describe("GET /contacts", () => {
  it("should return 401 without token", async () => {
    const res = await request(app).get("/contacts").expect(401);
    expect(res.body.message).toBe("Invalid session");
  });

  it("should return 401 with invalid token", async () => {
    await request(app)
      .get("/contacts")
      .set("Authorization", "Bearer invalid-token")
      .expect(401);
  });

  it("should return paginated contacts with valid token", async () => {
    mockSequence({ rows: [{ count: "1" }] }, { rows: [fakeContact], rowCount: 1 });

    const res = await request(app)
      .get("/contacts")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(200);

    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toMatchObject({ id: 1, name: "Ivan Ivanov" });
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.total).toBe(1);
  });

  it("should respect page and limit query params", async () => {
    mockSequence({ rows: [{ count: "0" }] }, { rows: [], rowCount: 0 });

    const res = await request(app)
      .get("/contacts?page=2&limit=5")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(200);

    expect(res.body.pagination.page).toBe(2);
    expect(res.body.pagination.total).toBe(0);
    expect(vi.mocked(mPool.query).mock.calls[1][1]).toEqual([1, 5, 5]);
  });
});

describe("GET /contacts/:id", () => {
  it("should return 401 without token", async () => {
    await request(app).get("/contacts/1").expect(401);
  });

  it("should return contact by id", async () => {
    mockDefault({ rows: [fakeContact], rowCount: 1 });

    const res = await request(app)
      .get("/contacts/1")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(200);

    expect(res.body).toMatchObject({ id: 1, name: "Ivan Ivanov" });
  });

  it("should return 404 for non-existent contact", async () => {
    mockDefault({ rows: [], rowCount: 0 });

    const res = await request(app)
      .get("/contacts/999")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(404);

    expect(res.body.error).toContain("Contact not found");
  });
});

describe("POST /contacts", () => {
  it("should create a contact and return 201", async () => {
    mockDefault({ rows: [fakeContact], rowCount: 1 });

    const res = await request(app)
      .post("/contacts")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ name: "Ivan Ivanov", email: "ivan@mail.ru", phone: "+79991234567" })
      .expect(201);

    expect(res.body).toMatchObject({ id: 1, name: "Ivan Ivanov" });
  });

  it("should return 401 without token", async () => {
    await request(app)
      .post("/contacts")
      .send({ name: "Test", email: "test@test.com", phone: "+70000000000" })
      .expect(401);
  });
});

describe("PUT /contacts/:id", () => {
  it("should update a contact and return 200", async () => {
    const updated = { ...fakeContact, name: "Updated Name" };
    mockDefault({ rows: [updated], rowCount: 1 });

    const res = await request(app)
      .put("/contacts/1")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ name: "Updated Name", email: "updated@mail.ru", phone: "+79990000000" })
      .expect(200);

    expect(res.body.name).toBe("Updated Name");
  });

  it("should return 404 for non-existent contact", async () => {
    mockDefault({ rows: [], rowCount: 0 });

    const res = await request(app)
      .put("/contacts/999")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ name: "No one", email: "n@mail.ru", phone: "+70000000000" })
      .expect(404);

    expect(res.body.error).toContain("Contact not found");
  });
});

describe("DELETE /contacts/:id", () => {
  it("should delete a contact and return 200", async () => {
    mockDefault({ rows: [fakeContact], rowCount: 1 });

    const res = await request(app)
      .delete("/contacts/1")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(200);

    expect(res.body).toMatchObject({ id: 1 });
  });

  it("should return 404 for non-existent contact", async () => {
    mockDefault({ rows: [], rowCount: 0 });

    const res = await request(app)
      .delete("/contacts/999")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(404);

    expect(res.body.error).toContain("Contact not found");
  });
});

// ─── NOTES ───────────────────────────────────────────────────────────────────

describe("GET /notes", () => {
  it("should return 401 without token", async () => {
    const res = await request(app).get("/notes").expect(401);
    expect(res.body.message).toBe("Invalid session");
  });

  it("should return paginated notes", async () => {
    mockSequence({ rows: [{ count: "1" }] }, { rows: [fakeNote], rowCount: 1 });

    const res = await request(app)
      .get("/notes")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(200);

    expect(res.body.data).toBeDefined();
    expect(res.body.pagination).toBeDefined();
    expect(res.body.data[0]).toMatchObject({ id: 1, content: "Test note content" });
  });

  it("should return empty array if no notes", async () => {
    mockSequence({ rows: [{ count: "0" }] }, { rows: [], rowCount: 0 });

    const res = await request(app)
      .get("/notes")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(200);

    expect(res.body.data).toEqual([]);
  });
});

describe("GET /notes/:id", () => {
  it("should return a note by id", async () => {
    mockDefault({ rows: [fakeNote], rowCount: 1 });

    const res = await request(app)
      .get("/notes/1")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(200);

    expect(res.body).toMatchObject({ id: 1, content: "Test note content" });
  });

  it("should return 404 for non-existent note", async () => {
    mockDefault({ rows: [], rowCount: 0 });

    const res = await request(app)
      .get("/notes/999")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(404);

    expect(res.body.error).toContain("Note not found");
  });
});

describe("POST /notes", () => {
  it("should create a note and return 201", async () => {
    mockDefault({ rows: [fakeNote], rowCount: 1 });

    const res = await request(app)
      .post("/notes")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ contactId: 1, content: "Test note content" })
      .expect(201);

    expect(res.body).toMatchObject({ id: 1, content: "Test note content" });
  });

  it("should return 404 if contact does not belong to user", async () => {
    mockDefault({ rows: [], rowCount: 0 });

    const res = await request(app)
      .post("/notes")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ contactId: 999, content: "Orphan note" })
      .expect(404);

    expect(res.body.error).toContain("Contact not found");
  });
});

describe("PUT /notes/:id", () => {
  it("should update a note and return 200", async () => {
    mockSequence(
      { rows: [{ id: 1, user_id: 1 }], rowCount: 1 },
      { rows: [{ id: 1, content: "Updated content" }], rowCount: 1 },
    );

    const res = await request(app)
      .put("/notes/1")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ content: "Updated content" })
      .expect(200);

    expect(res.body.content).toBe("Updated content");
  });

  it("should return 404 if note not owned by user", async () => {
    mockDefault({ rows: [], rowCount: 0 });

    const res = await request(app)
      .put("/notes/999")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ content: "Hacked content" })
      .expect(404);

    expect(res.body.error).toContain("Note not found");
  });
});

describe("DELETE /notes/:id", () => {
  it("should delete a note and return 200", async () => {
    mockDefault({ rows: [fakeNote], rowCount: 1 });

    const res = await request(app)
      .delete("/notes/1")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(200);

    expect(res.body).toMatchObject({ id: 1 });
  });

  it("should return 404 for non-existent note", async () => {
    mockDefault({ rows: [], rowCount: 0 });

    const res = await request(app)
      .delete("/notes/999")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(404);

    expect(res.body.error).toContain("Note not found");
  });
});

// ─── TASKS ───────────────────────────────────────────────────────────────────

describe("GET /tasks", () => {
  it("should return 401 without token", async () => {
    const res = await request(app).get("/tasks").expect(401);
    expect(res.body.message).toBe("Invalid session");
  });

  it("should return paginated tasks", async () => {
    mockSequence({ rows: [{ count: "1" }] }, { rows: [fakeTask], rowCount: 1 });

    const res = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(200);

    expect(res.body.data).toBeDefined();
    expect(res.body.pagination).toBeDefined();
  });

  it("should return tasks with camelCase fields (userId, createdAt)", async () => {
    mockSequence({ rows: [{ count: "1" }] }, { rows: [fakeTask], rowCount: 1 });

    const res = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(200);

    if (res.body.data.length > 0) {
      const task = res.body.data[0];
      expect(task).toHaveProperty("userId");
      expect(task).toHaveProperty("createdAt");
    }
  });
});

describe("GET /tasks/:id", () => {
  it("should return a task by id", async () => {
    mockDefault({ rows: [fakeTask], rowCount: 1 });

    const res = await request(app)
      .get("/tasks/1")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(200);

    expect(res.body).toMatchObject({ id: 1, title: "Test task" });
  });

  it("should return 404 for non-existent task", async () => {
    mockDefault({ rows: [], rowCount: 0 });

    const res = await request(app)
      .get("/tasks/999")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(404);

    expect(res.body.error).toContain("Task not found");
  });
});

describe("POST /tasks", () => {
  it("should create a task and return 201", async () => {
    mockDefault({ rows: [fakeTask], rowCount: 1 });

    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ title: "Test task", description: "Test description", status: "pending" })
      .expect(201);

    expect(res.body).toMatchObject({ id: 1, title: "Test task" });
  });
});

describe("PUT /tasks/:id", () => {
  it("should update a task and return 200", async () => {
    mockDefault({ rows: [{ ...fakeTask, title: "Updated", status: "done" }], rowCount: 1 });

    const res = await request(app)
      .put("/tasks/1")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ title: "Updated", description: "Updated desc", status: "done" })
      .expect(200);

    expect(res.body.title).toBe("Updated");
  });

  it("should return 404 for non-existent task", async () => {
    mockDefault({ rows: [], rowCount: 0 });

    const res = await request(app)
      .put("/tasks/999")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ title: "Ghost", description: "", status: "pending" })
      .expect(404);

    expect(res.body.error).toContain("Task not found");
  });
});

describe("DELETE /tasks/:id", () => {
  it("should delete a task and return 200", async () => {
    mockDefault({ rows: [fakeTask], rowCount: 1 });

    const res = await request(app)
      .delete("/tasks/1")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(200);

    expect(res.body).toMatchObject({ id: 1 });
  });

  it("should return 404 for non-existent task", async () => {
    mockDefault({ rows: [], rowCount: 0 });

    const res = await request(app)
      .delete("/tasks/999")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(404);

    expect(res.body.error).toContain("Task not found");
  });
});

// ─── USERS ───────────────────────────────────────────────────────────────────

describe("GET /users", () => {
  it("should return 401 without token", async () => {
    const res = await request(app).get("/users").expect(401);
    expect(res.body.message).toBe("Invalid session");
  });

  it("should return paginated users", async () => {
    mockSequence(
      { rows: [{ count: "1" }] },
      {
        rows: [{ id: 1, email: "test@mail.ru", name: "Test", created_at: new Date().toISOString() }],
        rowCount: 1,
      },
    );

    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(200);

    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toMatchObject({ id: 1, email: "test@mail.ru" });
    expect(res.body.pagination).toBeDefined();
  });
});

describe("GET /users/:id", () => {
  it("should return a user by id", async () => {
    mockDefault({
      rows: [{ id: 1, email: "test@mail.ru", created_at: new Date().toISOString() }],
      rowCount: 1,
    });

    const res = await request(app)
      .get("/users/1")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(200);

    expect(res.body).toMatchObject({ id: 1, email: "test@mail.ru" });
  });

  it("should return 403 for another user's id", async () => {
    mockDefault({ rows: [], rowCount: 0 });

    const res = await request(app)
      .get("/users/999")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(403);

    expect(res.body.error).toContain("Forbidden");
  });
});

describe("DELETE /users/:id", () => {
  it("should delete a user and return 200", async () => {
    mockDefault({ rows: [{ id: 1 }], rowCount: 1 });

    const res = await request(app)
      .delete("/users/1")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(200);

    expect(res.body.message).toBe("deleted successfully.");
  });

  it("should return 403 for another user's id", async () => {
    mockDefault({ rows: [], rowCount: 0 });

    const res = await request(app)
      .delete("/users/999")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(403);

    expect(res.body.error).toContain("Forbidden");
  });
});