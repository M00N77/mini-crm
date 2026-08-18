import { apiClient } from "@/shared/api";
import { PaginatedResponse } from "@/shared/types";
import { Note } from "../model/types";

export interface CreateNotePayload {
  content: string;
  contactId: number;
}

export interface UpdateNotePayload {
  content: string;
}

export interface GetNotesParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc" | "ASC" | "DESC";
}

export const getNotes = async (params?: GetNotesParams) => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params?.order) searchParams.set("order", params.order);

  const queryString = searchParams.toString();
  const endpoint = `/notes${queryString ? `?${queryString}` : ""}`;

  const data = await apiClient.get<PaginatedResponse<Note>>(endpoint);
  return data;
};

export const getNoteById = async (id: number) => {
  const data = await apiClient.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (payload: CreateNotePayload) => {
  const data = await apiClient.post<Note>("/notes", payload);
  return data;
};

export const updateNote = async (id: number, payload: UpdateNotePayload) => {
  const data = await apiClient.patch<Note>(`/notes/${id}`, payload);
  return data;
};

export const deleteNote = async (id: number) => {
  await apiClient.delete(`/notes/${id}`);
};
