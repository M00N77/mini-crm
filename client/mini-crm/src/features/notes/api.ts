import { api } from '@/src/lib/api/client'
import { DEFAULT_PAGE_SIZE } from '@/src/lib/constants/pagination'
import type { NoteJoinedDto, Paginated } from '@/src/types/dto'
import type { Note } from '@/src/types/domain'
import { mapNote } from './mapper'

export const notesApi = {
  // Бэкенд не умеет фильтровать /notes по контакту → тянем все и фильтруем на клиенте
  async listByContact(contactId: number): Promise<Note[]> {
    const res = await api.get<Paginated<NoteJoinedDto>>(`/notes?page=1&limit=${DEFAULT_PAGE_SIZE}`)
    return res.data.map(mapNote).filter((n) => n.contactId === contactId)
  },
  // ⚠️ тело в camelCase: contactId (НЕ contact_id)
  async create(contactId: number, content: string): Promise<void> {
    await api.post('/notes', { contactId, content })
  },
  async remove(id: number): Promise<void> {
    await api.delete(`/notes/${id}`)
  },
}
