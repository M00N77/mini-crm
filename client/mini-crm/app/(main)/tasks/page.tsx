'use client'
import { useState, useEffect, useCallback } from 'react'
import { TaskBoard } from '@/app/components/TaskBoard'
import { TaskFormModal } from '@/app/components/TaskFormModal'
import { Button } from '@/src/components/atoms/Button'
import { tasksApi, type TaskInput } from '@/src/features/tasks/api'
import type { Task, TaskStatus } from '@/src/types/domain'
import { DEFAULT_PAGE_SIZE } from '@/src/lib/constants/pagination'

type LoadStatus = 'idle' | 'loading' | 'success' | 'error'

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

  const editingTask = editingId != null ? tasks.find((t) => t.id === editingId) ?? null : null

  const openCreate = useCallback(() => { setEditingId(null); setFormError(null); setFormOpen(true) }, [])
  const openEdit = useCallback((id: number) => { setEditingId(id); setFormError(null); setFormOpen(true) }, [])

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

  const handleTaskMove = useCallback(async (id: number, status: TaskStatus) => {
    const task = tasks.find((t) => t.id === id)
    if (!task || task.status === status) return
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))
    try {
      await tasksApi.update(id, { title: task.title, description: task.description, status })
    } catch (e) {
      alert((e as Error).message || 'Не удалось переместить задачу')
      await load()
    }
  }, [tasks, load])

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', gap: 12 }}>
        <div style={{ color: 'var(--text-secondary, #8a8a8a)', fontSize: 14 }}>
          {total > DEFAULT_PAGE_SIZE ? `Показаны первые ${DEFAULT_PAGE_SIZE} из ${total} задач.` : ''}
        </div>
        <Button variant="primary" onClick={openCreate}>New Task</Button>
      </div>

      {loadStatus === 'loading' && tasks.length === 0 ? (
        <div style={centered}>Загрузка задач…</div>
      ) : loadStatus === 'error' ? (
        <div style={centered}>
          <span>{error}</span>
          <Button variant="secondary" onClick={() => load()}>Повторить</Button>
        </div>
      ) : (
        <TaskBoard tasks={tasks} onTaskClick={openEdit} onTaskMove={handleTaskMove} />
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
