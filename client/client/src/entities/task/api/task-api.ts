import { apiClient } from "@/shared/api";
import { Task } from "../model/types";

export interface CreateTaskPayload {
    title: string;
    description?: string;
    status: string;
    position?: number;
}

export interface UpdateTaskPayload {
    title: string;
    description?: string;
    status: string;
    position?: number;
}

export const getTasks = async () => {
    const data = await apiClient.get<Task[]>('/tasks');
    return data;
};

export const getTaskById = async (id: number) => {
    const data = await apiClient.get<Task>(`/tasks/${id}`);
    return data;
};

export const createTask = async (payload: CreateTaskPayload) => {
    const data = await apiClient.post<Task>('/tasks', payload);
    return data;
};

export const updateTask = async (id: number, payload: UpdateTaskPayload) => {
    const data = await apiClient.put<Task>(`/tasks/${id}`, payload);
    return data;
};

export const deleteTask = async (id: number) => {
    await apiClient.delete(`/tasks/${id}`);
};
