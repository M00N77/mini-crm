import { api } from '@/src/lib/api/client'
import type { Paginated, Pagination, TaskDto } from '@/src/types/dto'
import type { Task, TaskStatus } from '@/src/types/domain'
import { mapTask } from './mapper'
import { DEFAULT_PAGE_SIZE } from '@/src/lib/constants/pagination'

export interface TaskInput {
  title: string
  description: string
  status: TaskStatus
}

export const tasksApi = {
  async list(): Promise<{ tasks: Task[]; pagination: Pagination }> {
    const res = await api.get<Paginated<TaskDto>>(`/tasks?page=1&limit=${DEFAULT_PAGE_SIZE}`)
    return { tasks: res.data.map(mapTask), pagination: res.pagination }
  },
  async create(input: TaskInput): Promise<Task> {
    const dto = await api.post<TaskDto>('/tasks', input)
    return mapTask(dto)
  },
  async update(id: number, input: TaskInput): Promise<Task> {
    const dto = await api.put<TaskDto>(`/tasks/${id}`, input)
    return mapTask(dto)
  },
  async remove(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`)
  },
}
