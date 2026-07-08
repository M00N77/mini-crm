'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/src/components/organisms/Modal'
import { FormField } from '@/src/components/molecules/FormField'
import { Input } from '@/src/components/atoms/Input'
import { Button } from '@/src/components/atoms/Button'
import type { TaskInput } from '@/src/features/tasks/api'
import type { TaskStatus } from '@/src/types/domain'

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'pending', label: 'Todo' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

interface TaskFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (input: TaskInput) => Promise<void>
  onDelete?: () => void
  initial?: TaskInput | null
  title: string
  submitting?: boolean
  error?: string | null
}

export function TaskFormModal({ isOpen, onClose, onSubmit, onDelete, initial, title, submitting, error }: TaskFormModalProps) {
  const [taskTitle, setTaskTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('pending')

  useEffect(() => {
    if (isOpen) {
      setTaskTitle(initial?.title ?? '')
      setDescription(initial?.description ?? '')
      setStatus(initial?.status ?? 'pending')
    }
  }, [isOpen, initial])

  const canSubmit = Boolean(taskTitle.trim()) && !submitting

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    await onSubmit({ title: taskTitle.trim(), description: description.trim(), status })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Title">
          <Input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="Task title" />
        </FormField>
        <FormField label="Description">
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Details…" />
        </FormField>
        <FormField label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            style={{ width: '100%', padding: '8px 10px', background: 'var(--input-bg, #1a1a1a)', color: 'inherit', border: '1px solid var(--border, #333)', borderRadius: 8 }}
          >
            {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </FormField>
        {error && <span style={{ color: 'var(--color-error)', fontSize: 14 }}>{error}</span>}
        <div className="flex items-center justify-between gap-2 mt-2">
          <div>{onDelete && <Button type="button" variant="danger" onClick={onDelete}>Delete</Button>}</div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={!canSubmit}>{submitting ? 'Saving…' : 'Save'}</Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
