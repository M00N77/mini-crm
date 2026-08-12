import { apiClient } from "@/shared/api";
import { Contact } from "../model/types";

export interface CreateContactPayload {
    name: string;
    email: string;
    phone: string;
}

export interface UpdateContactPayload {
    name: string;
    email: string;
    phone: string;
}

export const getContacts = async () => {
    const data = await apiClient.get<Contact[]>('/contacts');
    return data;
};

export const getContactById = async (id: number) => {
    const data = await apiClient.get<Contact>(`/contacts/${id}`);
    return data;
};

export const createContact = async (payload: CreateContactPayload) => {
    const data = await apiClient.post<Contact>('/contacts', payload);
    return data;
};

export const updateContact = async (id: number, payload: UpdateContactPayload) => {
    const data = await apiClient.put<Contact>(`/contacts/${id}`, payload);
    return data;
};

export const deleteContact = async (id: number) => {
    await apiClient.delete(`/contacts/${id}`);
};