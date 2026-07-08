import type { TaskDto } from '@/src/types/dto'
import type { Task, TaskStatus } from '@/src/types/domain'

const VALID_STATUSES: TaskStatus[] = ['pending', 'in_progress', 'done']

export function normalizeStatus(raw: string): TaskStatus {
  return VALID_STATUSES.includes(raw as TaskStatus) ? (raw as TaskStatus) : 'pending'
}

export function mapTask(dto: TaskDto): Task {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description ?? '',
    status: normalizeStatus(dto.status),
    userId: dto.userId,
    createdAt: dto.createdAt,
  }
}
