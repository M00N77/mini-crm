import { api } from '@/src/lib/api/client';
import type { Notes } from '@/src/types/types';

export const notesApi = {
  list(contentId: number): Promise<Notes[]> {
    return api.get<Notes[]>(`/notes?contentId=${contentId}`);
  },

  create(body: Pick<Notes, 'content' | 'contentId'>): Promise<Notes> {
    return api.post<Notes>('/notes', body);
  },

  update(id: number, body: Pick<Notes, 'content'>): Promise<Notes> {
    return api.patch<Notes>(`/notes/${id}`, body);
  },

  delete(id: number): Promise<void> {
    return api.delete<void>(`/notes/${id}`);
  },
};
