import { setToken, clearToken } from './tokenStore'
import type { RefreshResponseDto } from '@/src/types/dto'

let isRefreshing = false
let refreshSubscribers: Array<(token: string | null) => void> = []

function notifySubscribers(token: string | null): void {
  refreshSubscribers.forEach((cb) => cb(token))
  refreshSubscribers = []
}

async function performRefresh(): Promise<string> {
  const root = process.env.NEXT_PUBLIC_API_ROOT
  const res = await fetch(`${root}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
  if (!res.ok) {
    throw new Error('Refresh failed')
  }
  const data: RefreshResponseDto = await res.json()
  return data.accessToken
}

export function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing) {
    return new Promise<string | null>((resolve) => {
      refreshSubscribers.push(resolve)
    })
  }

  isRefreshing = true

  return performRefresh()
    .then((token) => {
      setToken(token)
      notifySubscribers(token)
      return token
    })
    .catch(() => {
      clearToken()
      notifySubscribers(null)
      return null
    })
    .finally(() => {
      isRefreshing = false
    })
}
