import type { AccessTokenPayload } from '@/src/types/dto'

interface DecodedToken extends AccessTokenPayload {
  iat?: number
  exp?: number
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    const part = token.split('.')[1]
    if (!part) return null
    const normalized = part.replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(normalized)
    return JSON.parse(json) as DecodedToken
  } catch {
    return null
  }
}

export function isExpired(token: string): boolean {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return true
  return decoded.exp * 1000 <= Date.now()
}
