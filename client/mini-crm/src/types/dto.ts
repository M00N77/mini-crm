export interface ContactDto {
  id: number
  name: string
  email: string
  phone: string
  user_id: number
  created_at: string
}

export interface TaskDto {
  id: number
  title: string
  description: string
  userId: number
  status: string
  createdAt: string
}

export interface UserDto {
  id: number
  email: string
  name: string
  created_at: string
}

export interface NoteJoinedDto {
  id: number
  content: string
  contact_id: number
  created_at: string
  name: string
  email: string
  phone: string
}

export interface Pagination {
  page: number
  limit: number
  offset: number
  total: number
  totalPages: number
  hasMore: boolean
}

export interface Paginated<T> {
  data: T[]
  pagination: Pagination
}

export interface AuthUserDto {
  id: number
  email: string
  name: string
  created_at: string
}

export interface LoginResponseDto {
  user: AuthUserDto
  accessToken: string
}

export interface RegisterResponseDto {
  user: AuthUserDto
  accessToken: string
}

export interface RefreshResponseDto {
  accessToken: string
}

export interface AccessTokenPayload {
  userId: number
  email: string
}
