import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DashboardView } from '../../src/components/pages/DashboardView';
import { AppShell } from '../../src/components/layouts/AppShell';

const meta: Meta<typeof DashboardView> = {
  title: 'Pages/DashboardView',
  component: DashboardView,
};

export default meta;
type Story = StoryObj<typeof DashboardView>;

export const Default: Story = {};

export const InsideAppShell: Story = {
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
        <DashboardView />
      </AppShell>
    );
  },
};
