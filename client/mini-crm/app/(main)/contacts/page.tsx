'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { ContactsView } from '@/src/components/pages/ContactsView'
import { Drawer } from '@/src/components/organisms/Drawer'
import { ContactDrawer } from '@/app/components/ContactDrawer'
import { ContactFormModal } from '@/app/components/ContactFormModal'
import { contactsApi, type ContactInput } from '@/src/features/contacts/api'
import { DEFAULT_PAGE_SIZE } from '@/src/lib/constants/pagination'
import type { Contact } from '@/src/types/domain'
import type { ContactItem } from '@/src/components/pages/ContactsView'

type Status = 'idle' | 'loading' | 'success' | 'error'

function toItem(c: Contact): ContactItem {
  return { id: String(c.id), name: c.name, role: '', company: '', email: c.email, phone: c.phone, notesCount: 0 }
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [filterValue, setFilterValue] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setStatus('loading'); setError(null)
    try {
      const res = await contactsApi.list()
      setContacts(res.contacts); setTotal(res.pagination.total); setStatus('success')
    } catch (e) {
      setError((e as Error).message || 'Не удалось загрузить контакты'); setStatus('error')
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    const q = filterValue.trim().toLowerCase()
    const list = q
      ? contacts.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q))
      : contacts
    return list.map(toItem)
  }, [contacts, filterValue])

  const selectedContact = selectedId != null ? contacts.find((c) => c.id === selectedId) ?? null : null
  const editingContact = editingId != null ? contacts.find((c) => c.id === editingId) ?? null : null

  const openCreate = useCallback(() => { setEditingId(null); setFormError(null); setFormOpen(true) }, [])
  const openEdit = useCallback(() => { if (selectedId != null) { setEditingId(selectedId); setFormError(null); setFormOpen(true) } }, [selectedId])

  const handleSubmit = useCallback(async (input: ContactInput) => {
    setSaving(true); setFormError(null)
    try {
      if (editingId != null) await contactsApi.update(editingId, input)
      else await contactsApi.create(input)
      setFormOpen(false)
      await load()
    } catch (e) {
      setFormError((e as Error).message || 'Не удалось сохранить')
    } finally {
      setSaving(false)
    }
  }, [editingId, load])

  const handleDelete = useCallback(async () => {
    if (selectedId == null) return
    if (!confirm('Удалить контакт?')) return
    try {
      await contactsApi.remove(selectedId)
      setSelectedId(null)
      await load()
    } catch (e) {
      alert((e as Error).message || 'Не удалось удалить')
    }
  }, [selectedId, load])

  return (
    <>
      {total > DEFAULT_PAGE_SIZE && <div style={{ padding: '8px 16px', fontSize: 14, color: 'var(--text-secondary)' }}>Показаны первые {DEFAULT_PAGE_SIZE} из {total} контактов.</div>}
      {status === 'loading' && <div style={{ padding: 16 }}>Загрузка…</div>}
      {status === 'error' && <div style={{ padding: 16, color: 'var(--color-error)' }}>{error}</div>}
      <ContactsView
        contacts={filtered}
        filterValue={filterValue}
        onFilterChange={setFilterValue}
        onAddContact={openCreate}
        onSelectContact={(item) => setSelectedId(Number(item.id))}
      />
      <Drawer open={!!selectedContact} onClose={() => setSelectedId(null)} title={selectedContact?.name ?? ''} width={480}>
        {selectedContact && (
          <ContactDrawer
            name={selectedContact.name}
            role=""
            company=""
            email={selectedContact.email}
            phone={selectedContact.phone}
            notes={[]}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </Drawer>
      <ContactFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initial={editingContact ? { name: editingContact.name, email: editingContact.email, phone: editingContact.phone } : null}
        title={editingId != null ? 'Edit contact' : 'New contact'}
        submitting={saving}
        error={formError}
      />
    </>
  )
}