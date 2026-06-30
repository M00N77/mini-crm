import { Fragment } from 'react';
import { FiPlus, FiMail, FiPhone } from 'react-icons/fi';
import { Typography } from '../atoms/Typography';
import { Card } from '../molecules/Card';
import { Avatar } from '../atoms/Avatar';
import { SearchInput } from '../molecules/SearchInput';
import { Button } from '../atoms/Button';
import { Divider } from '../atoms/Divider';

interface ContactItem {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  notesCount: number;
}

interface ContactsViewProps {
  contacts?: ContactItem[];
  onAddContact?: () => void;
  filterValue?: string;
  onFilterChange?: (v: string) => void;
}

const defaultContacts: ContactItem[] = [
  { id: '1', name: 'Alice Smith', role: 'CEO', company: 'Acme Inc', email: 'alice@acme.com', phone: '+1 234 567 890', notesCount: 12 },
  { id: '2', name: 'Bob Johnson', role: 'Designer', company: 'Pixel Co', email: 'bob@pixel.co', phone: '+1 234 567 891', notesCount: 5 },
  { id: '3', name: 'Carol Williams', role: 'Developer', company: 'Tech Corp', email: 'carol@techcorp.com', phone: '+1 234 567 892', notesCount: 8 },
  { id: '4', name: 'Dave Brown', role: 'Product Manager', company: 'Build Inc', email: 'dave@build.io', phone: '+1 234 567 893', notesCount: 3 },
  { id: '5', name: 'Eve Davis', role: 'Marketing Lead', company: 'Growth Co', email: 'eve@growth.co', phone: '+1 234 567 894', notesCount: 15 },
  { id: '6', name: 'Frank Miller', role: 'Engineer', company: 'DevHouse', email: 'frank@devhouse.com', phone: '+1 234 567 895', notesCount: 7 },
];

export function ContactsView({
  contacts = defaultContacts,
  onAddContact,
  filterValue = '',
  onFilterChange,
}: ContactsViewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <style>{`
        .contact-card:hover .contact-view-link {
          opacity: 1;
        }
      `}</style>

      {/* Section 1: Title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <Typography as="h1">Contacts</Typography>
        <Typography as="caption">Everyone in your network</Typography>
      </div>

      {/* Section 2: Search + Add */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
        }}
      >
        <div style={{ flex: 1, maxWidth: 360 }}>
          <SearchInput
            value={filterValue}
            onChange={(v) => onFilterChange?.(v)}
            placeholder="Filter contacts…"
          />
        </div>
        <Button onClick={onAddContact} iconLeft={<FiPlus size={16} />}>
          Add Contact
        </Button>
      </div>

      {/* Section 3: Contact Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--space-6)',
        }}
      >
        {contacts.map((contact) => (
          <div key={contact.id} className="contact-card">
            <Card.Root>
              <Card.Header>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                  }}
                >
                  <Avatar name={contact.name} size="md" />
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        color: 'var(--text-primary)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {contact.name}
                    </div>
                    <div
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: 'var(--text-xs)',
                      }}
                    >
                      {contact.role} &middot; {contact.company}
                    </div>
                  </div>
                </div>
              </Card.Header>

              <Card.Content>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-2)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      color: 'var(--text-secondary)',
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    <FiMail size={14} />
                    <span>{contact.email}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      color: 'var(--text-secondary)',
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    <FiPhone size={14} />
                    <span>{contact.phone}</span>
                  </div>
                </div>
              </Card.Content>

              <Card.Footer>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    {contact.notesCount} notes
                  </span>
                  <span
                    className="contact-view-link"
                    style={{
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-sm)',
                      cursor: 'pointer',
                      opacity: 0,
                      transition: 'opacity 0.15s ease',
                    }}
                  >
                    View details &rarr;
                  </span>
                </div>
              </Card.Footer>
            </Card.Root>
          </div>
        ))}
      </div>
    </div>
  );
}

export type { ContactsViewProps };
export type { ContactItem };
