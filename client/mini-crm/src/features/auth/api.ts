import { api } from '@/src/lib/api/client'
import { setToken, clearToken } from '@/src/lib/api/tokenStore'
import type { LoginResponseDto, RegisterResponseDto, UserDto } from '@/src/types/dto'
import type { User } from '@/src/types/domain'

function mapUser(dto: UserDto): User {
  return {
    id: dto.id,
    email: dto.email,
    name: dto.name,
    createdAt: dto.created_at,
  }
}

export async function login(email: string, password: string): Promise<User> {
  const res = await api.post<LoginResponseDto>('/auth/login', { email, password })
  setToken(res.accessToken)
  return mapUser(res.user)
}

export async function register(email: string, password: string, name: string): Promise<User> {
  const res = await api.post<RegisterResponseDto>('/auth/register', { email, password, name })
  setToken(res.accessToken)
  return mapUser(res.user)
}

export async function logout(): Promise<void> {
  try {
    await api.post<{ message: string }>('/auth/logout')
  } finally {
    clearToken()
  }
}

export async function getUserById(id: number): Promise<User> {
  const res = await api.get<UserDto>(`/users/${id}`)
  return mapUser(res)
}
