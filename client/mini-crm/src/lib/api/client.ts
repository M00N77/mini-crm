import { getToken, clearToken } from './tokenStore'
import { refreshAccessToken } from './refresh'
import { ApiError } from './errors'
import { authEvents } from '@/src/lib/auth/events'

const API_ROOT = process.env.NEXT_PUBLIC_API_ROOT ?? ''

interface RequestOptions {
  method?: string
  body?: unknown
  _retry?: boolean
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_ROOT}${path}`, {
    method: options.method ?? 'GET',
    credentials: 'include',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  if (
    res.status === 401 &&
    !options._retry &&
    !path.startsWith('/auth/')
  ) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      return request<T>(path, { ...options, _retry: true })
    }
    clearToken()
    authEvents.emitLogout()
    throw new ApiError(401, 'Unauthorized')
  }

  if (!res.ok) {
    let message = res.statusText
    try {
      const errData = await res.json()
      message = errData.message ?? errData.error ?? message
    } catch {
    }
    throw new ApiError(res.status, message)
  }

  if (res.status === 204) {
    return undefined as T
  }

  return (await res.json()) as T
}

export const api = {
  get: <T>(path: string): Promise<T> => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown): Promise<T> =>
    request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown): Promise<T> =>
    request<T>(path, { method: 'PUT', body }),
  delete: <T>(path: string): Promise<T> => request<T>(path, { method: 'DELETE' }),
}

export { request }
