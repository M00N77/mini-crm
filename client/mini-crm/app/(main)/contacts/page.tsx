'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { ContactsView } from '@/src/components/pages/ContactsView'
import { Drawer } from '@/src/components/organisms/Drawer'
import { ContactDrawer } from '@/app/components/ContactDrawer'
import { contactsApi } from '@/src/features/contacts/api'
import { DEFAULT_PAGE_SIZE } from '@/src/lib/constants/pagination'
import type { Contact } from '@/src/types/domain'
import type { ContactItem } from '@/src/components/pages/ContactsView'

type Status = 'idle' | 'loading' | 'success' | 'error'

// Бэкенд отдаёт только name/email/phone — role/company/notesCount в модели нет.
// До редизайна (Фаза 7) подставляем пустые значения, вёрстку не трогаем.
function toItem(c: Contact): ContactItem {
  return {
    id: String(c.id),
    name: c.name,
    role: '',
    company: '',
    email: c.email,
    phone: c.phone,
    notesCount: 0,
  }
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [filterValue, setFilterValue] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const load = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const { contacts, pagination } = await contactsApi.list()
      setContacts(contacts)
      setTotal(pagination.total)
      setStatus('success')
    } catch (e) {
      setError((e as Error).message || 'Не удалось загрузить контакты')
      setStatus('error')
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    const q = filterValue.trim().toLowerCase()
    const list = q
      ? contacts.filter((c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q))
      : contacts
    return list.map(toItem)
  }, [contacts, filterValue])

  const selectedContact = selectedId != null ? contacts.find((c) => c.id === selectedId) ?? null : null
  const handleClose = useCallback(() => setSelectedId(null), [])

  return (
    <>
      {total > DEFAULT_PAGE_SIZE && (
        <div style={{ padding: '8px 16px', fontSize: 14, color: 'var(--text-secondary)' }}>
          Показаны первые {DEFAULT_PAGE_SIZE} из {total} контактов.
        </div>
      )}
      {status === 'loading' && <div style={{ padding: 16, color: 'var(--text-secondary)' }}>Загрузка…</div>}
      {status === 'error' && <div style={{ padding: 16, color: 'var(--color-error)' }}>{error}</div>}
      <ContactsView
        contacts={filtered}
        filterValue={filterValue}
        onFilterChange={setFilterValue}
        onAddContact={() => console.log('Add contact')}
        onSelectContact={(item) => setSelectedId(Number(item.id))}
      />
      <Drawer open={!!selectedContact} onClose={handleClose} title={selectedContact?.name ?? ''} width={480}>
        {selectedContact && (
          <ContactDrawer
            name={selectedContact.name}
            role=""
            company=""
            email={selectedContact.email}
            phone={selectedContact.phone}
            notes={[]}
          />
        )}
      </Drawer>
    </>
  )
}
