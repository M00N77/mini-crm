import { apiClient } from "@/shared/api";
import { Note } from "../model/types";

export interface CreateNotePayload {
    content: string;
    contactId: number;
}

export interface UpdateNotePayload {
    content: string;
}

export const getNotes = async () => {
    const data = await apiClient.get<Note[]>('/notes');
    return data;
};

export const getNoteById = async (id: number) => {
    const data = await apiClient.get<Note>(`/notes/${id}`);
    return data;
};

export const createNote = async (payload: CreateNotePayload) => {
    const data = await apiClient.post<Note>('/notes', payload);
    return data;
};

export const updateNote = async (id: number, payload: UpdateNotePayload) => {
    const data = await apiClient.put<Note>(`/notes/${id}`, payload);
    return data;
};

export const deleteNote = async (id: number) => {
    await apiClient.delete(`/notes/${id}`);
};
