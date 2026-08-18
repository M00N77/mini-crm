import { apiClient } from "@/shared/api";
import { PaginatedResponse } from "@/shared/types";
import { Task, TaskStatus } from "../model/types";

export interface CreateTaskPayload {
  title: string;
  description?: string | null;
  status?: TaskStatus | string;
  position?: number;
}

export interface UpdateTaskPayload {
  title: string;
  description?: string | null;
  status: TaskStatus | string;
  position?: number;
}

export interface PatchTaskPayload {
  title?: string;
  description?: string | null;
  status?: TaskStatus | string;
  position?: number;
}

export interface GetTasksParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc" | "ASC" | "DESC";
}

export const getTasks = async (params?: GetTasksParams) => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params?.order) searchParams.set("order", params.order);

  const queryString = searchParams.toString();
  const endpoint = `/tasks${queryString ? `?${queryString}` : ""}`;

  const data = await apiClient.get<PaginatedResponse<Task>>(endpoint);
  return data;
};

export const getTaskById = async (id: number) => {
  const data = await apiClient.get<Task>(`/tasks/${id}`);
  return data;
};

export const createTask = async (payload: CreateTaskPayload) => {
  const data = await apiClient.post<Task>("/tasks", payload);
  return data;
};

export const updateTask = async (id: number, payload: UpdateTaskPayload) => {
  const data = await apiClient.put<Task>(`/tasks/${id}`, payload);
  return data;
};

export const patchTask = async (id: number, payload: PatchTaskPayload) => {
  const data = await apiClient.patch<Task>(`/tasks/${id}`, payload);
  return data;
};

export const deleteTask = async (id: number) => {
  await apiClient.delete(`/tasks/${id}`);
};
