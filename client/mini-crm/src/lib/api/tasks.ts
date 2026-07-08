import { api } from '@/src/lib/api/client';
import type { Task } from '@/src/types/types';

export const tasksApi = {
  list(): Promise<Task[]> {
    return api.get<Task[]>('/tasks');
  },

  get(id: number): Promise<Task> {
    return api.get<Task>(`/tasks/${id}`);
  },

  create(body: Pick<Task, 'title' | 'description' | 'status'>): Promise<Task> {
    return api.post<Task>('/tasks', body);
  },

  update(id: number, body: Partial<Pick<Task, 'title' | 'description' | 'status'>>): Promise<Task> {
    return api.patch<Task>(`/tasks/${id}`, body);
  },

  delete(id: number): Promise<void> {
    return api.delete<void>(`/tasks/${id}`);
  },
};
