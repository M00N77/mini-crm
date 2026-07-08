'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { ContactsView } from '@/src/components/pages/ContactsView'
import { Drawer } from '@/src/components/organisms/Drawer'
import { ContactDrawer, type DrawerNote } from '@/app/components/ContactDrawer'
import { ContactFormModal } from '@/app/components/ContactFormModal'
import { Button } from '@/src/components/atoms/Button'
import { contactsApi, type ContactInput } from '@/src/features/contacts/api'
import { notesApi } from '@/src/features/notes/api'
import { DEFAULT_PAGE_SIZE } from '@/src/lib/constants/pagination'
import type { Contact, Note } from '@/src/types/domain'
import type { ContactItem } from '@/src/components/pages/ContactsView'

type Status = 'idle' | 'loading' | 'success' | 'error'

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const s = Math.floor((Date.now() - then) / 1000)
  if (s < 60) return 'только что'
  const m = Math.floor(s / 60); if (m < 60) return `${m} мин назад`
  const h = Math.floor(m / 60); if (h < 24) return `${h} ч назад`
  return `${Math.floor(h / 24)} дн назад`
}

const centered: React.CSSProperties = {
  minHeight: 320, display: 'flex', flexDirection: 'column',
  alignItems: 'center', justifyContent: 'center', gap: 12,
  color: 'var(--text-secondary, #8a8a8a)', padding: 24, textAlign: 'center',
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [filterValue, setFilterValue] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [allNotes, setAllNotes] = useState<Note[]>([])

  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [sendingNote, setSendingNote] = useState(false)

  const loadNotes = useCallback(async () => {
    try { setAllNotes(await notesApi.listAll()) } catch { setAllNotes([]) }
  }, [])

  const load = useCallback(async () => {
    setStatus('loading'); setError(null)
    try {
      const res = await contactsApi.list()
      setContacts(res.contacts); setTotal(res.pagination.total); setStatus('success')
    } catch (e) {
      setError((e as Error).message || 'Не удалось загрузить контакты'); setStatus('error')
    }
  }, [])

  useEffect(() => { load(); loadNotes() }, [load, loadNotes])

  const notesCountByContact = useMemo(() => {
    const m = new Map<number, number>()
    for (const n of allNotes) m.set(n.contactId, (m.get(n.contactId) ?? 0) + 1)
    return m
  }, [allNotes])

  const toItem = useCallback((c: Contact): ContactItem => ({
    id: String(c.id), name: c.name, role: '', company: '',
    email: c.email, phone: c.phone, notesCount: notesCountByContact.get(c.id) ?? 0,
  }), [notesCountByContact])

  const filtered = useMemo(() => {
    const q = filterValue.trim().toLowerCase()
    const list = q
      ? contacts.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q))
      : contacts
    return list.map(toItem)
  }, [contacts, filterValue, toItem])

  const selectedContact = selectedId != null ? contacts.find((c) => c.id === selectedId) ?? null : null
  const editingContact = editingId != null ? contacts.find((c) => c.id === editingId) ?? null : null

  const drawerNotes = useMemo<DrawerNote[]>(() => {
    if (selectedId == null) return []
    return allNotes.filter((n) => n.contactId === selectedId)
      .map((n) => ({ id: n.id, text: n.content, timeAgo: timeAgo(n.createdAt) }))
  }, [allNotes, selectedId])

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
    } finally { setSaving(false) }
  }, [editingId, load])

  const handleDelete = useCallback(async () => {
    if (selectedId == null) return
    if (!confirm('Удалить контакт?')) return
    try {
      await contactsApi.remove(selectedId)
      setSelectedId(null)
      await load(); await loadNotes()
    } catch (e) { alert((e as Error).message || 'Не удалось удалить') }
  }, [selectedId, load, loadNotes])

  const handleSendNote = useCallback(async (text: string) => {
    if (selectedId == null) return
    setSendingNote(true)
    try { await notesApi.create(selectedId, text); await loadNotes() }
    catch (e) { alert((e as Error).message || 'Не удалось добавить заметку') }
    finally { setSendingNote(false) }
  }, [selectedId, loadNotes])

  const handleDeleteNote = useCallback(async (id: number) => {
    try { await notesApi.remove(id); await loadNotes() }
    catch (e) { alert((e as Error).message || 'Не удалось удалить заметку') }
  }, [loadNotes])

  return (
    <>
      {total > DEFAULT_PAGE_SIZE && (
        <div style={{ padding: '8px 16px', fontSize: 14, color: 'var(--text-secondary, #8a8a8a)' }}>
          Показаны первые {DEFAULT_PAGE_SIZE} из {total} контактов.
        </div>
      )}

      {status === 'loading' && contacts.length === 0 ? (
        <div style={centered}>Загрузка контактов…</div>
      ) : status === 'error' ? (
        <div style={centered}>
          <span>{error}</span>
          <Button variant="secondary" onClick={() => load()}>Повторить</Button>
        </div>
      ) : contacts.length === 0 ? (
        <div style={centered}>
          <span>Пока нет контактов.</span>
          <Button variant="primary" onClick={openCreate}>Добавить контакт</Button>
        </div>
      ) : (
        <>
          <ContactsView
            contacts={filtered}
            filterValue={filterValue}
            onFilterChange={setFilterValue}
            onAddContact={openCreate}
            onSelectContact={(item) => setSelectedId(Number(item.id))}
          />
          {filtered.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary, #8a8a8a)' }}>
              Ничего не найдено по запросу «{filterValue}».
            </div>
          )}
        </>
      )}

      <Drawer open={!!selectedContact} onClose={() => setSelectedId(null)} title={selectedContact?.name ?? ''} width={480}>
        {selectedContact && (
          <ContactDrawer
            name={selectedContact.name}
            role=""
            company=""
            email={selectedContact.email}
            phone={selectedContact.phone}
            notes={drawerNotes}
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
