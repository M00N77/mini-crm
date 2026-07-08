import { useState } from 'react';
import { FiMail, FiPhone, FiHome, FiEdit2, FiTrash2, FiSend, FiX } from 'react-icons/fi';
import { Avatar } from '@/src/components/atoms/Avatar';
import { Typography } from '@/src/components/atoms/Typography';
import { Divider } from '@/src/components/atoms/Divider';
import { Badge } from '@/src/components/atoms/Badge';
import { Button } from '@/src/components/atoms/Button';
import { Input } from '@/src/components/atoms/Input';
import { IconButton } from '@/src/components/atoms/IconButton';
import { TimelineItem } from '@/src/components/molecules/TimelineItem';

export interface DrawerNote { id: number; text: string; timeAgo: string }

interface ContactDrawerProps {
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  notes: DrawerNote[];
  onEdit?: () => void;
  onDelete?: () => void;
  onSendNote?: (text: string) => void | Promise<void>;
  onDeleteNote?: (id: number) => void | Promise<void>;
  sendingNote?: boolean;
}

export function ContactDrawer({
  name,
  role,
  company,
  email,
  phone,
  notes,
  onEdit,
  onDelete,
  onSendNote,
  onDeleteNote,
  sendingNote,
}: ContactDrawerProps) {
  const [noteText, setNoteText] = useState('')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Avatar + Name / Role */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <Avatar name={name} size="lg" />
        <div>
          <Typography as="h3">{name}</Typography>
          <Typography as="caption">
            {role} &middot; {company}
          </Typography>
        </div>
      </div>

      {/* Contact details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
          <FiMail size={14} />
          <span>{email}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
          <FiPhone size={14} />
          <span>{phone}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
          <FiHome size={14} />
          <span>{company}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <Button variant="secondary" size="sm" iconLeft={<FiEdit2 size={14} />} onClick={onEdit}>
          Edit
        </Button>
        <Button variant="danger" size="sm" iconLeft={<FiTrash2 size={14} />} onClick={onDelete}>
          Delete
        </Button>
      </div>

      <Divider />

      {/* Notes timeline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <Typography as="h3">Notes timeline</Typography>
        <Badge variant="info">{notes.length}</Badge>
      </div>

      <div>
        {notes.length === 0 ? (
          <Typography as="caption">No notes yet.</Typography>
        ) : (
          notes.map((note) => (
            <TimelineItem key={note.id} date={note.timeAgo}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography as="p">{note.text}</Typography>
                <IconButton icon={<FiX size={12} />} label="Delete note" onClick={() => onDeleteNote?.(note.id)} style={{ flexShrink: 0 }} />
              </div>
            </TimelineItem>
          ))
        )}
      </div>

      {/* Note input */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'auto' }}>
        <Input placeholder="Write a note…" value={noteText} onChange={(e) => setNoteText(e.target.value)} disabled={sendingNote} />
        <IconButton icon={<FiSend size={18} />} label="Send note" disabled={!noteText.trim() || sendingNote} onClick={async () => { if (!noteText.trim() || sendingNote) return; await onSendNote?.(noteText.trim()); setNoteText('') }} />
      </div>
    </div>
  );
}
