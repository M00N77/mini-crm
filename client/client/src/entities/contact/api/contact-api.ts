import { apiClient } from "@/shared/api";
import { PaginatedResponse } from "@/shared/types";
import { Contact } from "../model/types";

export interface CreateContactPayload {
  name: string;
  email: string;
  phone: string;
  company?: string | null;
  jobPosition?: string | null;
  position?: string | null;
}

export interface UpdateContactPayload {
  name: string;
  email: string;
  phone: string;
  company?: string | null;
  jobPosition?: string | null;
  position?: string | null;
}

export interface GetContactsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc" | "ASC" | "DESC";
}

export const getContacts = async (params?: GetContactsParams) => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params?.order) searchParams.set("order", params.order);

  const queryString = searchParams.toString();
  const endpoint = `/contacts${queryString ? `?${queryString}` : ""}`;

  const data = await apiClient.get<PaginatedResponse<Contact>>(endpoint);
  return data;
};

export const getContactById = async (id: number) => {
  const data = await apiClient.get<Contact>(`/contacts/${id}`);
  return data;
};

export const createContact = async (payload: CreateContactPayload) => {
  const data = await apiClient.post<Contact>("/contacts", payload);
  return data;
};

export const updateContact = async (id: number, payload: UpdateContactPayload) => {
  const data = await apiClient.put<Contact>(`/contacts/${id}`, payload);
  return data;
};

export const deleteContact = async (id: number) => {
  await apiClient.delete(`/contacts/${id}`);
};