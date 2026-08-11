import { describe, it, expect } from "vitest";
import { resolveSort } from "../utils/sort";

const ALLOWED: Record<string, string> = {
  name: "name",
  createdAt: "created_at",
};

describe("resolveSort", () => {
  it("maps whitelisted keys to columns and direction", () => {
    expect(
      resolveSort("createdAt", "desc", ALLOWED, { orderBy: "id", orderDir: "ASC" }),
    ).toEqual({ orderBy: "created_at", orderDir: "DESC" });
  });

  it("falls back to defaults for unknown keys or invalid direction", () => {
    expect(
      resolveSort("evil; drop", "asc", ALLOWED, { orderBy: "id", orderDir: "ASC" }),
    ).toEqual({ orderBy: "id", orderDir: "ASC" });
    expect(
      resolveSort("name", "sideways", ALLOWED, { orderBy: "id", orderDir: "ASC" }),
    ).toEqual({ orderBy: "name", orderDir: "ASC" });
    expect(
      resolveSort(undefined, undefined, ALLOWED, { orderBy: "id", orderDir: "ASC" }),
    ).toEqual({ orderBy: "id", orderDir: "ASC" });
  });

  it("never lets non-whitelisted input reach the order clause", () => {
    const res = resolveSort("name; drop table users", "desc", ALLOWED, {
      orderBy: "id",
      orderDir: "ASC",
    });
    expect(res.orderBy).not.toMatch(/drop|;| /);
  });

  it("ignores prototype keys instead of crashing", () => {
    for (const key of ["__proto__", "constructor", "hasOwnProperty"]) {
      const res = resolveSort(key, "asc", ALLOWED, {
        orderBy: "id",
        orderDir: "ASC",
      });
      expect(res).toEqual({ orderBy: "id", orderDir: "ASC" });
    }
  });
});
