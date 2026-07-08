'use client';

import { useState, useCallback } from 'react';
import { ContactsView } from '@/src/components/pages/ContactsView';
import { Drawer } from '@/src/components/organisms/Drawer';
import { ContactDrawer } from '@/app/components/ContactDrawer';
import { MOCK_CONTACTS, MOCK_CONTACT_NOTES } from '@/src/lib/mock';
import type { ContactItem } from '@/src/components/pages/ContactsView';

export default function ContactsPage() {
  const [filterValue, setFilterValue] = useState('');
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(null);

  const notes = selectedContact ? MOCK_CONTACT_NOTES[selectedContact.id] ?? [] : [];

  const handleClose = useCallback(() => setSelectedContact(null), []);

  return (
    <>
      <ContactsView
        contacts={MOCK_CONTACTS}
        filterValue={filterValue}
        onFilterChange={setFilterValue}
        onAddContact={() => console.log('Add contact')}
        onSelectContact={setSelectedContact}
      />

      <Drawer
        open={!!selectedContact}
        onClose={handleClose}
        title={selectedContact?.name ?? ''}
        width={480}
      >
        {selectedContact && (
          <ContactDrawer
            name={selectedContact.name}
            role={selectedContact.role}
            company={selectedContact.company}
            email={selectedContact.email}
            phone={selectedContact.phone}
            notes={notes}
          />
        )}
      </Drawer>
    </>
  );
}
