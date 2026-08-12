import { apiClient } from "@/shared/api";
import { User } from "../model/types";

export const getUsers = async () => {
    const data = await apiClient.get<User[]>('/users');
    return data;
};

export const getMe = async () => {
    const data = await apiClient.get<User>('/users/me');
    return data;
};

export const getUserById = async (id: number) => {
    const data = await apiClient.get<User>(`/users/${id}`);
    return data;
};

export const deleteUser = async (id: number) => {
    await apiClient.delete(`/users/${id}`);
};
