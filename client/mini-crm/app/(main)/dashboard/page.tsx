'use client'
import { useState, useEffect, useCallback } from 'react'
import { DashboardView } from '@/src/components/pages/DashboardView'
import { Button } from '@/src/components/atoms/Button'
import { dashboardApi, type DashboardData } from '@/src/features/dashboard/api'
import { tasksApi } from '@/src/features/tasks/api'

type LoadStatus = 'idle' | 'loading' | 'success' | 'error'

const centered: React.CSSProperties = {
  minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center',
  justifyContent: 'center', gap: 12, color: 'var(--text-secondary, #8a8a8a)', padding: 24, textAlign: 'center',
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const s = Math.floor((Date.now() - then) / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60); if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24); if (d < 7) return `${d}d ago`
  return new Date(iso).toLocaleDateString()
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [status, setStatus] = useState<LoadStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [taskValue, setTaskValue] = useState('')
  const [addingTask, setAddingTask] = useState(false)

  const load = useCallback(async () => {
    setStatus('loading'); setError(null)
    try {
      const d = await dashboardApi.getDashboardData()
      setData(d); setStatus('success')
    } catch (e) {
      setError((e as Error).message || 'Не удалось загрузить дашборд'); setStatus('error')
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleAddTask = useCallback(async () => {
    const title = taskValue.trim()
    if (!title || addingTask) return
    setAddingTask(true)
    try {
      await tasksApi.create({ title, description: '', status: 'pending' })
      setTaskValue('')
      await load()
    } catch (e) {
      alert((e as Error).message || 'Не удалось добавить задачу')
    } finally { setAddingTask(false) }
  }, [taskValue, addingTask, load])

  if (status === 'loading' && !data) {
    return <div style={centered}>Загрузка дашборда…</div>
  }
  if (status === 'error' && !data) {
    return (
      <div style={centered}>
        <span>{error}</span>
        <Button variant="secondary" onClick={() => load()}>Повторить</Button>
      </div>
    )
  }

  const stats = data ? [
    { label: 'Total Contacts', value: data.contactsTotal, delta: '' },
    { label: 'Pending Tasks', value: data.pipeline.pending, delta: '' },
    { label: 'Completed', value: data.pipeline.done, delta: '' },
  ] : []

  const pipeline = data ? [
    { label: 'Todo' as const, count: data.pipeline.pending },
    { label: 'In Progress' as const, count: data.pipeline.in_progress },
    { label: 'Done' as const, count: data.pipeline.done },
  ] : []

  const recentContacts = data ? data.recentContacts.map((c) => ({
    id: String(c.id),
    name: c.name,
    role: c.email,
    company: c.phone,
    lastActive: timeAgo(c.createdAt),
  })) : []

  const upNext = data ? data.upNextTasks.map((t) => ({ id: String(t.id), title: t.title })) : []

  return (
    <DashboardView
      stats={stats}
      recentContacts={recentContacts}
      pipeline={pipeline}
      upNext={upNext}
      taskValue={taskValue}
      onTaskChange={setTaskValue}
      onAddTask={handleAddTask}
    />
  )
}