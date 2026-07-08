import { contactsApi } from '@/src/features/contacts/api'
import { tasksApi } from '@/src/features/tasks/api'
import type { Contact, Task } from '@/src/types/domain'

export interface DashboardData {
  contactsTotal: number
  tasksTotal: number
  pipeline: { pending: number; in_progress: number; done: number }
  recentContacts: Contact[]
  upNextTasks: Task[]
}

export const dashboardApi = {
  async getDashboardData(): Promise<DashboardData> {
    const [contactsRes, tasksRes] = await Promise.all([
      contactsApi.list(),
      tasksApi.list(),
    ])

    const contacts = contactsRes.contacts
    const tasks = tasksRes.tasks

    const pipeline = { pending: 0, in_progress: 0, done: 0 }
    for (const t of tasks) {
      if (t.status === 'pending') pipeline.pending++
      else if (t.status === 'in_progress') pipeline.in_progress++
      else if (t.status === 'done') pipeline.done++
    }

    const recentContacts = [...contacts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4)

    const upNextTasks = tasks.filter((t) => t.status !== 'done').slice(0, 4)

    return {
      contactsTotal: contactsRes.pagination.total,
      tasksTotal: tasksRes.pagination.total,
      pipeline,
      recentContacts,
      upNextTasks,
    }
  },
}