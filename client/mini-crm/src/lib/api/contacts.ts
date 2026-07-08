import { api } from '@/src/lib/api/client';
import type { Contact } from '@/src/types/types';

export const contactsApi = {
  list(): Promise<Contact[]> {
    return api.get<Contact[]>('/contacts');
  },

  get(id: number): Promise<Contact> {
    return api.get<Contact>(`/contacts/${id}`);
  },

  create(body: Pick<Contact, 'name' | 'email' | 'phone'>): Promise<Contact> {
    return api.post<Contact>('/contacts', body);
  },

  update(id: number, body: Partial<Pick<Contact, 'name' | 'email' | 'phone'>>): Promise<Contact> {
    return api.patch<Contact>(`/contacts/${id}`, body);
  },

  delete(id: number): Promise<void> {
    return api.delete<void>(`/contacts/${id}`);
  },
};
