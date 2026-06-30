import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { AppShell } from '../../src/components/layouts/AppShell';
import { Typography } from '../../src/components/atoms/Typography';
import { Card } from '../../src/components/molecules/Card';

const meta: Meta<typeof AppShell> = {
  title: 'Layouts/AppShell',
  component: AppShell,
};

export default meta;
type Story = StoryObj<typeof AppShell>;

export const Default: Story = {
  render: () => {
    const [activeRoute, setActiveRoute] = useState('contacts');
    const [search, setSearch] = useState('');

    return (
      <AppShell
        activeRoute={activeRoute}
        onNavigate={setActiveRoute}
        searchValue={search}
        onSearchChange={setSearch}
        userName="Alice Smith"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Typography as="h1">Contacts</Typography>

          <Card.Root>
            <Card.Content>
              <Typography as="p">Welcome to the Mini CRM. Select a contact or create a new one.</Typography>
            </Card.Content>
          </Card.Root>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            {['Alice Smith', 'Bob Johnson', 'Carol Williams'].map((name) => (
              <Card.Root key={name}>
                <Card.Content>
                  <Typography as="h3">{name}</Typography>
                  <Typography as="p">{name.toLowerCase().replace(' ', '.')}@example.com</Typography>
                </Card.Content>
              </Card.Root>
            ))}
          </div>
        </div>
      </AppShell>
    );
  },
};
