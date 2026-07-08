'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { TasksView } from '@/src/components/pages/TasksView'
import { TaskFormModal } from '@/app/components/TaskFormModal'
import { Button } from '@/src/components/atoms/Button'
import { tasksApi, type TaskInput } from '@/src/features/tasks/api'
import type { Task, TaskStatus } from '@/src/types/domain'
import { DEFAULT_PAGE_SIZE } from '@/src/lib/constants/pagination'

type LoadStatus = 'idle' | 'loading' | 'success' | 'error'

const COLUMNS: { id: string; status: TaskStatus; label: 'Todo' | 'In Progress' | 'Done'; variant: 'info' | 'warning' | 'success' }[] = [
  { id: 'todo', status: 'pending', label: 'Todo', variant: 'info' },
  { id: 'in-progress', status: 'in_progress', label: 'In Progress', variant: 'warning' },
  { id: 'done', status: 'done', label: 'Done', variant: 'success' },
]

const centered: React.CSSProperties = {
  minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center',
  justifyContent: 'center', gap: 12, color: 'var(--text-secondary, #8a8a8a)', padding: 24, textAlign: 'center',
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [total, setTotal] = useState(0)
  const [loadStatus, setLoadStatus] = useState<LoadStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoadStatus('loading'); setError(null)
    try {
      const res = await tasksApi.list()
      setTasks(res.tasks); setTotal(res.pagination.total); setLoadStatus('success')
    } catch (e) {
      setError((e as Error).message || 'Не удалось загрузить задачи'); setLoadStatus('error')
    }
  }, [])

  useEffect(() => { load() }, [load])

  const columns = useMemo(() => COLUMNS.map((col) => ({
    id: col.id,
    title: col.label,
    tasks: tasks
      .filter((t) => t.status === col.status)
      .map((t) => ({ id: String(t.id), title: t.title, description: t.description, status: col.label })),
  })), [tasks])

  const editingTask = editingId != null ? tasks.find((t) => t.id === editingId) ?? null : null

  const openCreate = useCallback(() => { setEditingId(null); setFormError(null); setFormOpen(true) }, [])
  const openEdit = useCallback((id: string) => { setEditingId(Number(id)); setFormError(null); setFormOpen(true) }, [])

  const handleSubmit = useCallback(async (input: TaskInput) => {
    setSaving(true); setFormError(null)
    try {
      if (editingId != null) await tasksApi.update(editingId, input)
      else await tasksApi.create(input)
      setFormOpen(false)
      await load()
    } catch (e) {
      setFormError((e as Error).message || 'Не удалось сохранить')
    } finally { setSaving(false) }
  }, [editingId, load])

  const handleDelete = useCallback(async () => {
    if (editingId == null) return
    if (!confirm('Удалить задачу?')) return
    try {
      await tasksApi.remove(editingId)
      setFormOpen(false); setEditingId(null)
      await load()
    } catch (e) { alert((e as Error).message || 'Не удалось удалить') }
  }, [editingId, load])

  return (
    <>
      {total > DEFAULT_PAGE_SIZE && (
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Показаны первые {DEFAULT_PAGE_SIZE} из {total} задач.
        </div>
      )}

      {loadStatus === 'loading' && tasks.length === 0 ? (
        <div style={centered}>Загрузка задач…</div>
      ) : loadStatus === 'error' ? (
        <div style={centered}>
          <span>{error}</span>
          <Button variant="secondary" onClick={() => load()}>Повторить</Button>
        </div>
      ) : (
        <TasksView columns={columns} onNewTask={openCreate} onTaskClick={openEdit} />
      )}

      <TaskFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        onDelete={editingId != null ? handleDelete : undefined}
        initial={editingTask ? { title: editingTask.title, description: editingTask.description, status: editingTask.status } : null}
        title={editingId != null ? 'Edit task' : 'New task'}
        submitting={saving}
        error={formError}
      />
    </>
  )
}
