export type TaskStatus = 'pending' | 'in_progress' | 'done'

export interface User {
  id: number
  email: string
  name: string
  createdAt: string
}

export interface Contact {
  id: number
  name: string
  email: string
  phone: string
  userId: number
  createdAt: string
}

export interface Task {
  id: number
  title: string
  description: string
  userId: number
  status: TaskStatus
  createdAt: string
}

export interface Note {
  id: number
  content: string
  contactId: number
  userId: number
  createdAt: string
}
