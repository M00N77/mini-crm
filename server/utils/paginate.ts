import pool from "../db";
import { AppError } from "../utils/AppError";
import { ORDER_DIRS } from "./sort";

const allowedFromClauses = new Set([
  "users",
  "tasks",
  "contacts",
  "notes join contacts on contacts.id = notes.contact_id",
]);

const allowedUserIdColumns = new Set(["user_id", "id", "contacts.user_id"]);

const ORDER_RE = /^[a-z_][a-z_0-9]*(\.[a-z_][a-z_0-9]*)?$/;
const IDENT_RE = /^(\*|[a-z_][a-z_0-9]*(\.[a-z_*][a-z_0-9*]*)?)$/;

function isSafeColumns(s: string) {
  return s.split(",").every((part) => IDENT_RE.test(part.trim()));
}

export interface PaginationMeta {
  page: number;
  limit: number;
  offset: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

interface PaginateParams {
  fromClause: string;
  columns: string;
  userIdColumn: string;
  userId: number;
  orderBy?: string;
  orderDir?: "ASC" | "DESC";
  pageInput: number;
  limitInput: number;
}

export async function paginate<T = any>(params: PaginateParams) {
  const {
    fromClause,
    columns,
    userIdColumn,
    userId,
    orderBy = "id",
    orderDir = "ASC",
    pageInput,
    limitInput,
  } = params;

  if (!allowedFromClauses.has(fromClause)) {
    throw new AppError("Invalid fromClause", 500);
  }
  if (!allowedUserIdColumns.has(userIdColumn)) {
    throw new AppError("Invalid userIdColumn", 500);
  }
  if (!ORDER_RE.test(orderBy)) throw new AppError("Invalid orderBy", 500);
  if (!ORDER_DIRS.has(orderDir)) throw new AppError("Invalid orderDir", 500);
  if (!isSafeColumns(columns)) throw new AppError("Invalid columns", 500);

  const client = await pool.connect();
  let committed = false;
  try {
    await client.query("begin isolation level repeatable read");

    const countResult = await client.query(
      `select count(*) from ${fromClause} where ${userIdColumn}=$1`,
      [userId],
    );
    const total = Number(countResult.rows[0].count);

    const page = Math.max(1, Number(pageInput) || 1);
    const limit = Math.min(100, Math.max(1, Number(limitInput) || 10));
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const hasMore = page < totalPages;

    const dataResult = await client.query(
      `select ${columns} from ${fromClause} where ${userIdColumn}=$1 order by ${orderBy} ${orderDir} offset $2 limit $3`,
      [userId, offset, limit],
    );

    await client.query("commit");
    committed = true;

    return {
      rows: dataResult.rows as T[],
      pagination: { page, limit, offset, total, totalPages, hasMore },
    };
  } catch (err) {
    if (!committed) await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}
