import { api } from '@/src/lib/api/client'
import { DEFAULT_PAGE_SIZE } from '@/src/lib/constants/pagination'
import type { ContactDto, Paginated, Pagination } from '@/src/types/dto'
import type { Contact } from '@/src/types/domain'
import { mapContact } from './mapper'

export interface ContactInput {
  name: string
  email: string
  phone: string
}

export const contactsApi = {
  async list(): Promise<{ contacts: Contact[]; pagination: Pagination }> {
    const res = await api.get<Paginated<ContactDto>>(`/contacts?page=1&limit=${DEFAULT_PAGE_SIZE}`)
    return { contacts: res.data.map(mapContact), pagination: res.pagination }
  },
  async create(input: ContactInput): Promise<Contact> {
    const dto = await api.post<ContactDto>('/contacts', input)
    return mapContact(dto)
  },
  async update(id: number, input: ContactInput): Promise<Contact> {
    const dto = await api.put<ContactDto>(`/contacts/${id}`, input)
    return mapContact(dto)
  },
  async remove(id: number): Promise<void> {
    await api.delete(`/contacts/${id}`)
  },
}
