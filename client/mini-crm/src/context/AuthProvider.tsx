'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { bootstrapSession } from '@/src/lib/auth/bootstrap'
import { authEvents } from '@/src/lib/auth/events'
import * as authApi from '@/src/features/auth/api'
import type { User } from '@/src/types/domain'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthContextValue {
  status: AuthStatus
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    let cancelled = false
    bootstrapSession()
      .then((u) => {
        if (cancelled) return
        setUser(u)
        setStatus(u ? 'authenticated' : 'unauthenticated')
      })
      .catch(() => {
        if (cancelled) return
        setUser(null)
        setStatus('unauthenticated')
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const unsubscribe = authEvents.onLogout(() => {
      setUser(null)
      setStatus('unauthenticated')
    })
    return unsubscribe
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const u = await authApi.login(email, password)
    setUser(u)
    setStatus('authenticated')
  }, [])

  const register = useCallback(async (email: string, password: string, name: string) => {
    const u = await authApi.register(email, password, name)
    setUser(u)
    setStatus('authenticated')
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  return (
    <AuthContext.Provider value={{ status, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
