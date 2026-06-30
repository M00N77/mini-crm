import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ContactsView } from '../../src/components/pages/ContactsView';
import { AppShell } from '../../src/components/layouts/AppShell';

const meta: Meta<typeof ContactsView> = {
  title: 'Pages/ContactsView',
  component: ContactsView,
};

export default meta;
type Story = StoryObj<typeof ContactsView>;

export const Default: Story = {};

export const InsideAppShell: Story = {
  render: () => {
    const [activeRoute, setActiveRoute] = useState('contacts');
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');

    return (
      <AppShell
        activeRoute={activeRoute}
        onNavigate={setActiveRoute}
        searchValue={search}
        onSearchChange={setSearch}
        userName="Alice Smith"
      >
        <ContactsView filterValue={filter} onFilterChange={setFilter} />
      </AppShell>
    );
  },
};
