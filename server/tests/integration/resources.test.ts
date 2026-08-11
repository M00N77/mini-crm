import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";
import pool, { ensureSchema, truncateAll } from "./helpers/db";

const baseContact = {
  name: "Ivan Ivanov",
  email: "ivan@mail.ru",
  phone: "+79991234567",
};

async function registerUser(email: string) {
  const res = await request(app)
    .post("/auth/register")
    .send({ email, password: "password123", name: "Test User" })
    .expect(201);
  return {
    accessToken: res.body.accessToken,
    cookie: res.headers["set-cookie"][0].split(";")[0],
  };
}

function bearer(token: string) {
  return { Authorization: `Bearer ${token}` };
}

beforeAll(async () => {
  await ensureSchema();
});

beforeEach(async () => {
  await truncateAll();
});

afterAll(async () => {
  await pool.end();
});

describe("CONTACTS", () => {
  it("creates, lists, gets, updates and deletes a contact", async () => {
    const { accessToken } = await registerUser("c1@example.com");
    const auth = bearer(accessToken);

    const created = await request(app)
      .post("/contacts")
      .set(auth)
      .send(baseContact)
      .expect(201);

    expect(created.body).toMatchObject({
      id: expect.any(Number),
      name: "Ivan Ivanov",
      email: "ivan@mail.ru",
      phone: "+79991234567",
      userId: expect.any(Number),
    });

    const list = await request(app).get("/contacts").set(auth).expect(200);
    expect(list.body.data).toHaveLength(1);
    expect(list.body.pagination.total).toBe(1);

    const got = await request(app)
      .get(`/contacts/${created.body.id}`)
      .set(auth)
      .expect(200);
    expect(got.body.id).toBe(created.body.id);

    const updated = await request(app)
      .put(`/contacts/${created.body.id}`)
      .set(auth)
      .send({ ...baseContact, name: "Updated Name" })
      .expect(200);
    expect(updated.body.name).toBe("Updated Name");

    await request(app)
      .delete(`/contacts/${created.body.id}`)
      .set(auth)
      .expect(200);

    await request(app)
      .get(`/contacts/${created.body.id}`)
      .set(auth)
      .expect(404);
  });

  it("does not expose another user's contact", async () => {
    const userA = await registerUser("c2a@example.com");
    const userB = await registerUser("c2b@example.com");

    const created = await request(app)
      .post("/contacts")
      .set(bearer(userA.accessToken))
      .send(baseContact)
      .expect(201);

    await request(app)
      .get(`/contacts/${created.body.id}`)
      .set(bearer(userB.accessToken))
      .expect(404);

    await request(app)
      .put(`/contacts/${created.body.id}`)
      .set(bearer(userB.accessToken))
      .send(baseContact)
      .expect(404);

    await request(app)
      .delete(`/contacts/${created.body.id}`)
      .set(bearer(userB.accessToken))
      .expect(404);
  });
});

describe("TASKS", () => {
  it("creates a task and rejects invalid status via schema", async () => {
    const { accessToken } = await registerUser("t1@example.com");
    const auth = bearer(accessToken);

    const created = await request(app)
      .post("/tasks")
      .set(auth)
      .send({ title: "Task one", description: "desc", status: "in_progress" })
      .expect(201);

    expect(created.body).toMatchObject({
      id: expect.any(Number),
      title: "Task one",
      status: "in_progress",
      userId: expect.any(Number),
    });

    const invalid = await request(app)
      .post("/tasks")
      .set(auth)
      .send({ title: "Hacked", status: "DROP TABLE users" })
      .expect(400);
    expect(invalid.body.error).toContain("status");

    const missing = await request(app)
      .post("/tasks")
      .set(auth)
      .send({ title: "No status" })
      .expect(400);
    expect(missing.body.error).toContain("status");
  });

  it("partially updates a task with PATCH and fully replaces with PUT", async () => {
    const { accessToken } = await registerUser("t2@example.com");
    const auth = bearer(accessToken);

    const created = await request(app)
      .post("/tasks")
      .set(auth)
      .send({ title: "Task two", status: "pending", position: 1 })
      .expect(201);

    const patched = await request(app)
      .patch(`/tasks/${created.body.id}`)
      .set(auth)
      .send({ status: "done" })
      .expect(200);
    expect(patched.body.status).toBe("done");
    expect(patched.body.title).toBe("Task two");

    const dbRow = await pool.query(
      "select status, title, position from tasks where id = $1",
      [created.body.id],
    );
    expect(dbRow.rows[0]).toMatchObject({ status: "done", position: 1 });

    const replaced = await request(app)
      .put(`/tasks/${created.body.id}`)
      .set(auth)
      .send({
        title: "Renamed",
        description: "new desc",
        status: "pending",
        position: 5,
      })
      .expect(200);
    expect(replaced.body).toMatchObject({
      title: "Renamed",
      status: "pending",
      position: 5,
    });

    await request(app)
      .put(`/tasks/${created.body.id}`)
      .set(auth)
      .send({ title: "No position", status: "pending" })
      .expect(400);
  });

  it("rejects invalid PATCH payloads", async () => {
    const { accessToken } = await registerUser("t3@example.com");
    const auth = bearer(accessToken);

    const created = await request(app)
      .post("/tasks")
      .set(auth)
      .send({ title: "Task three", status: "pending", position: 1 })
      .expect(201);

    await request(app)
      .patch(`/tasks/${created.body.id}`)
      .set(auth)
      .send({ status: "not-a-status" })
      .expect(400);

    await request(app)
      .patch(`/tasks/${created.body.id}`)
      .set(auth)
      .send({})
      .expect(400);
  });

  it("sorts by whitelisted columns and falls back on unknown sortBy", async () => {
    const { accessToken } = await registerUser("t5@example.com");
    const auth = bearer(accessToken);

    await request(app)
      .post("/tasks")
      .set(auth)
      .send({ title: "Alpha", status: "pending", position: 3 })
      .expect(201);
    await request(app)
      .post("/tasks")
      .set(auth)
      .send({ title: "Beta", status: "done", position: 1 })
      .expect(201);
    await request(app)
      .post("/tasks")
      .set(auth)
      .send({ title: "Gamma", status: "in_progress", position: 2 })
      .expect(201);

    const sorted = await request(app)
      .get("/tasks?sortBy=status&order=desc")
      .set(auth)
      .expect(200);
    expect(sorted.body.data.map((t: any) => t.status)).toEqual([
      "pending",
      "in_progress",
      "done",
    ]);

    const byPosition = await request(app)
      .get("/tasks?sortBy=position&order=asc")
      .set(auth)
      .expect(200);
    expect(byPosition.body.data.map((t: any) => t.position)).toEqual([1, 2, 3]);

    const fallback = await request(app)
      .get("/tasks?sortBy=unknownField")
      .set(auth)
      .expect(200);
    expect(fallback.body.data.map((t: any) => t.title)).toEqual([
      "Alpha",
      "Beta",
      "Gamma",
    ]);
  });

  it("does not expose another user's task and enforces DB CHECK constraint", async () => {
    const userA = await registerUser("t4a@example.com");
    const userB = await registerUser("t4b@example.com");

    const created = await request(app)
      .post("/tasks")
      .set(bearer(userA.accessToken))
      .send({ title: "Task A", status: "pending", position: 1 })
      .expect(201);

    await request(app)
      .patch(`/tasks/${created.body.id}`)
      .set(bearer(userB.accessToken))
      .send({ status: "done" })
      .expect(404);

    await request(app)
      .delete(`/tasks/${created.body.id}`)
      .set(bearer(userB.accessToken))
      .expect(404);

    const dbUser = await pool.query("select id from users where email = $1", [
      "t4a@example.com",
    ]);

    await expect(
      pool.query(
        "insert into tasks (title, description, user_id, status, position) values ($1,$2,$3,$4,$5)",
        ["Bad", null, dbUser.rows[0].id, "DROP TABLE users", 1],
      ),
    ).rejects.toMatchObject({ code: "23514" });
  });
});

describe("NOTES", () => {
  it("creates a note only for an owned contact, updates and deletes it", async () => {
    const { accessToken } = await registerUser("n1@example.com");
    const auth = bearer(accessToken);

    const contact = await request(app)
      .post("/contacts")
      .set(auth)
      .send(baseContact)
      .expect(201);

    const created = await request(app)
      .post("/notes")
      .set(auth)
      .send({ contactId: contact.body.id, content: "First note" })
      .expect(201);

    expect(created.body).toMatchObject({
      id: expect.any(Number),
      contactId: contact.body.id,
      content: "First note",
    });

    const list = await request(app).get("/notes").set(auth).expect(200);
    expect(list.body.data).toHaveLength(1);

    const got = await request(app)
      .get(`/notes/${created.body.id}`)
      .set(auth)
      .expect(200);
    expect(got.body.content).toBe("First note");

    const updated = await request(app)
      .patch(`/notes/${created.body.id}`)
      .set(auth)
      .send({ content: "Updated note" })
      .expect(200);
    expect(updated.body.content).toBe("Updated note");

    await request(app)
      .delete(`/notes/${created.body.id}`)
      .set(auth)
      .expect(200);
  });

  it("rejects creating a note for a contact the user does not own", async () => {
    const userA = await registerUser("n2a@example.com");
    const userB = await registerUser("n2b@example.com");

    const contact = await request(app)
      .post("/contacts")
      .set(bearer(userA.accessToken))
      .send(baseContact)
      .expect(201);

    const res = await request(app)
      .post("/notes")
      .set(bearer(userB.accessToken))
      .send({ contactId: contact.body.id, content: "Orphan note" })
      .expect(404);
    expect(res.body.error).toContain("Contact not found");

    const orphanRows = await pool.query("select * from notes");
    expect(orphanRows.rows).toHaveLength(0);
  });

  it("does not let another user read or update a note", async () => {
    const userA = await registerUser("n3a@example.com");
    const userB = await registerUser("n3b@example.com");

    const contact = await request(app)
      .post("/contacts")
      .set(bearer(userA.accessToken))
      .send(baseContact)
      .expect(201);

    const note = await request(app)
      .post("/notes")
      .set(bearer(userA.accessToken))
      .send({ contactId: contact.body.id, content: "Private note" })
      .expect(201);

    await request(app)
      .get(`/notes/${note.body.id}`)
      .set(bearer(userB.accessToken))
      .expect(404);

    await request(app)
      .patch(`/notes/${note.body.id}`)
      .set(bearer(userB.accessToken))
      .send({ content: "Hacked" })
      .expect(404);
  });
});
