import pool from "../db";
import { AppError } from "../utils/AppError";



const allowedFromClauses = new Set([
  "users",
  "tasks",
  "contacts",
  "notes join contacts on contacts.id = notes.contactId",
]);

export async function paginate(fromClause:string,userId?: number,userIdColumn?:string,pageInput?:number,limitInput?:number) {
    if (!allowedFromClauses.has(fromClause)) {
      throw new AppError("Invalid fromClause", 500);
    }
    let totalElements
    if(userId != null){
        totalElements  = Number((await pool.query(`select count(*) from ${fromClause} where ${userIdColumn}=$1`, [userId])).rows[0].count);
    } else {
        totalElements  = Number((await pool.query(`select count(*) from ${fromClause}`)).rows[0].count);
    }

    const page = Math.max(1, Number(pageInput) || 1);
    const limit = Math.min(100, Math.max(1, Number(limitInput) || 10));
    const totalPages = Math.ceil(totalElements / limit);
    const offset = (page - 1) * limit;
    const hasMore = page < totalPages;


    return {
            "page":page,
            "limit":limit,
            "total":totalElements,
            "totalPages":totalPages,
            "hasMore":hasMore
    };
}
