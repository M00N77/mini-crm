import { AppError } from "../utils/AppError";
import { paginate } from "../utils/paginate";
import { UserDto } from "../mappers/auth.mapper";
import * as usersRepository from '../repositories/users.repository';

export async function getUsers(userId: number, pageInput:number,limitInput:number,) {
  const paginateData = await paginate('users',pageInput,limitInput);
  const { offset, limit, ...pagination } = paginateData;
  const rows = await usersRepository.findUsers(offset, limit);
  return {
    data: rows.map((row: any) => new UserDto(row)),
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
