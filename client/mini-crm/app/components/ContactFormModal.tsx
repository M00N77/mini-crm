'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/src/components/organisms/Modal'
import { FormField } from '@/src/components/molecules/FormField'
import { Input } from '@/src/components/atoms/Input'
import { Button } from '@/src/components/atoms/Button'
import type { ContactInput } from '@/src/features/contacts/api'

interface ContactFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (input: ContactInput) => Promise<void>
  initial?: ContactInput | null
  title: string
  submitting?: boolean
  error?: string | null
}

export function ContactFormModal({ isOpen, onClose, onSubmit, initial, title, submitting, error }: ContactFormModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    if (isOpen) {
      setName(initial?.name ?? '')
      setEmail(initial?.email ?? '')
      setPhone(initial?.phone ?? '')
    }
  }, [isOpen, initial])

  const canSubmit = Boolean(name.trim() && email.trim() && phone.trim()) && !submitting

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    await onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim() })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
        </FormField>
        <FormField label="Email">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" />
        </FormField>
        <FormField label="Phone">
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 000 000-0000" />
        </FormField>
        {error && <span style={{ color: 'var(--color-error)', fontSize: 14 }}>{error}</span>}
        <div className="flex justify-end gap-2 mt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={!canSubmit} loading={submitting}>Save</Button>
        </div>
      </form>
    </Modal>
  )
}