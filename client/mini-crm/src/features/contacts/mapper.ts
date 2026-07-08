import type { ContactDto } from '@/src/types/dto'
import type { Contact } from '@/src/types/domain'

export function mapContact(dto: ContactDto): Contact {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    phone: dto.phone,
    userId: dto.user_id,
    createdAt: dto.created_at,
  }
}
