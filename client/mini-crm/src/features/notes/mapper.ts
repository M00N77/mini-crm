import type { NoteJoinedDto } from '@/src/types/dto'
import type { Note } from '@/src/types/domain'

export function mapNote(dto: NoteJoinedDto): Note {
  return {
    id: dto.id,
    content: dto.content,
    contactId: dto.contact_id,
    userId: dto.user_id,
    createdAt: dto.created_at,
  }
}
