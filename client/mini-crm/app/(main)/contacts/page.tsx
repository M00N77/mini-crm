'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { ContactsView } from '@/src/components/pages/ContactsView'
import { Drawer } from '@/src/components/organisms/Drawer'
import { ContactDrawer, type DrawerNote } from '@/app/components/ContactDrawer'
import { ContactFormModal } from '@/app/components/ContactFormModal'
import { contactsApi, type ContactInput } from '@/src/features/contacts/api'
import { notesApi } from '@/src/features/notes/api'
import { DEFAULT_PAGE_SIZE } from '@/src/lib/constants/pagination'
import type { Contact } from '@/src/types/domain'
import type { ContactItem } from '@/src/components/pages/ContactsView'

type Status = 'idle' | 'loading' | 'success' | 'error'

function toItem(c: Contact): ContactItem {
  return { id: String(c.id), name: c.name, role: '', company: '', email: c.email, phone: c.phone, notesCount: 0 }
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const s = Math.floor((Date.now() - then) / 1000)
  if (s < 60) return 'только что'
  const m = Math.floor(s / 60); if (m < 60) return `${m} мин назад`
  const h = Math.floor(m / 60); if (h < 24) return `${h} ч назад`
  return `${Math.floor(h / 24)} дн назад`
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

  const [notes, setNotes] = useState<DrawerNote[]>([])
  const [sendingNote, setSendingNote] = useState(false)

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

  const loadNotes = useCallback(async (contactId: number) => {
    try {
      const list = await notesApi.listByContact(contactId)
      setNotes(list.map((n) => ({ id: n.id, text: n.content, timeAgo: timeAgo(n.createdAt) })))
    } catch {
      setNotes([])
    }
  }, [])

  useEffect(() => {
    if (selectedId != null) loadNotes(selectedId)
    else setNotes([])
  }, [selectedId, loadNotes])

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

  const handleSendNote = useCallback(async (text: string) => {
    if (selectedId == null) return
    setSendingNote(true)
    try {
      await notesApi.create(selectedId, text)
      await loadNotes(selectedId)
    } catch (e) {
      alert((e as Error).message || 'Не удалось добавить заметку')
    } finally {
      setSendingNote(false)
    }
  }, [selectedId, loadNotes])

  const handleDeleteNote = useCallback(async (id: number) => {
    if (selectedId == null) return
    try {
      await notesApi.remove(id)
      await loadNotes(selectedId)
    } catch (e) {
      alert((e as Error).message || 'Не удалось удалить заметку')
    }
  }, [selectedId, loadNotes])

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
            notes={notes}
            onEdit={openEdit}
            onDelete={handleDelete}
            onSendNote={handleSendNote}
            onDeleteNote={handleDeleteNote}
            sendingNote={sendingNote}
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
