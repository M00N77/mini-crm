import { AppError } from "../utils/AppError";
import { paginate } from "../utils/paginate";
import { resolveSort } from "../utils/sort";
import { UserDto } from "../mappers/auth.mapper";
import * as usersRepository from '../repositories/users.repository';

const USER_SORT: Record<string, string> = {
  email: "email",
  name: "name",
  createdAt: "created_at",
};

export async function getUsers(userId: number, pageInput:number,limitInput:number, sortBy?: string, order?: string) {
  const { orderBy, orderDir } = resolveSort(sortBy, order, USER_SORT, { orderBy: "id", orderDir: "ASC" });
  const { rows, pagination: paginationData } = await paginate({
    fromClause: 'users',
    columns: 'id, email, name, created_at',
    orderBy,
    orderDir,
    pageInput,
    limitInput,
  });
  const { offset, limit, ...pagination } = paginationData;
  return {
    data: rows.map((row) => new UserDto(row)),
    pagination,
  };
}

export async function getUserById(id: number) {
  const row = await usersRepository.findUserById(id);
  if (!row) throw new AppError("User not found", 404);
  return new UserDto(row);
}

export async function deleteUser(id: number) {
  const row = await usersRepository.deleteUser(id);
  if (!row) throw new AppError("User not found", 404);
  return row;
}

export async function getUserInfo(userId: number) {
  const row = await usersRepository.findUserById(userId);
  if (!row) throw new AppError("User not found", 404);

  return new UserDto(row);
}
