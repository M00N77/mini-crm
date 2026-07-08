import { refreshAccessToken } from '@/src/lib/api/refresh'
import { decodeToken } from '@/src/lib/auth/jwt'
import { getUserById } from '@/src/features/auth/api'
import type { User } from '@/src/types/domain'

export async function bootstrapSession(): Promise<User | null> {
  const token = await refreshAccessToken()
  if (!token) return null

  const decoded = decodeToken(token)
  if (!decoded || !decoded.userId) return null

  try {
    return await getUserById(decoded.userId)
  } catch {
    return null
  }
}
