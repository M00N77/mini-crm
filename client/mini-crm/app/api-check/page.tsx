'use client'

import { useState } from 'react'
import { api } from '@/src/lib/api/client'
import { getToken, setToken, clearToken } from '@/src/lib/api/tokenStore'

const TEST_EMAIL = 'apicheck@example.com'
const TEST_PASSWORD = 'Test1234!'
const TEST_NAME = 'API Check'

type AuthResponse = { user: { id: number; name: string }; accessToken: string }

export default function ApiCheckPage() {
  const [log, setLog] = useState<string[]>([])

  function add(msg: string) {
    setLog((prev) => [...prev, msg])
  }

  async function safe(label: string, fn: () => Promise<void>) {
    try {
      await fn()
    } catch (err) {
      if (err instanceof TypeError) {
        add(`❌ ${label}: сетевая ошибка / ВОЗМОЖЕН CORS-блокер (${err.message})`)
      } else {
        add(`❌ ${label}: ${(err as Error).message}`)
      }
    }
  }

  const register = () =>
    safe('register', async () => {
      const res = await api.post<AuthResponse>('/auth/register', {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        name: TEST_NAME,
      })
      setToken(res.accessToken)
      add(`✅ register: user #${res.user.id} ${res.user.name}, токен сохранён`)
    })

  const login = () =>
    safe('login', async () => {
      const res = await api.post<AuthResponse>('/auth/login', {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      })
      setToken(res.accessToken)
      add(`✅ login: user #${res.user.id} ${res.user.name}, токен сохранён`)
    })

  const getContacts = () =>
    safe('GET /contacts', async () => {
      const res = await api.get<{ data: unknown[]; pagination: { total: number } }>(
        '/contacts?page=1&limit=5',
      )
      add(`✅ GET /contacts: элементов ${res.data.length}, total=${res.pagination.total}`)
    })

  const testAutoRefresh = () =>
    safe('auto-refresh', async () => {
      const before = getToken()
      setToken('broken.access.token')
      await api.get('/contacts?page=1&limit=1')
      const after = getToken()
      add(
        after && after !== before && after !== 'broken.access.token'
          ? '✅ auto-refresh: протухший токен заменён новым, запрос прошёл'
          : '⚠️ auto-refresh: запрос прошёл, но токен не сменился — проверь refresh.ts',
      )
    })

  const testParallel = () =>
    safe('3 параллельных 401', async () => {
      setToken('broken.access.token')
      add('▶ открой вкладку Network и считай запросы на /auth/refresh — должен быть РОВНО ОДИН')
      await Promise.all([
        api.get('/contacts?page=1&limit=1'),
        api.get('/contacts?page=1&limit=1'),
        api.get('/contacts?page=1&limit=1'),
      ])
      add('✅ 3 параллельных запроса завершились — сверь в Network: refresh должен быть один')
    })

  const logout = () =>
    safe('logout', async () => {
      const res = await api.post<{ message: string }>('/auth/logout')
      clearToken()
      add(`✅ logout: "${res.message}", токен очищен`)
    })

  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <h1>API check — временная страница (удалить в Фазе 6)</h1>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <button onClick={register}>1. register</button>
        <button onClick={login}>2. login</button>
        <button onClick={getContacts}>3. GET contacts</button>
        <button onClick={testAutoRefresh}>4. auto-refresh</button>
        <button onClick={testParallel}>5. 3x parallel 401</button>
        <button onClick={logout}>6. logout</button>
        <button onClick={() => setLog([])}>clear</button>
      </div>
      <pre style={{ background: '#111', color: '#0f0', padding: 12, minHeight: 200, whiteSpace: 'pre-wrap' }}>
        {log.join('\n')}
      </pre>
    </div>
  )
}
