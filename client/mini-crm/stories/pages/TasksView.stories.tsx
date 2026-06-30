import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TasksView } from '../../src/components/pages/TasksView';
import { AppShell } from '../../src/components/layouts/AppShell';

const meta: Meta<typeof TasksView> = {
  title: 'Pages/TasksView',
  component: TasksView,
};

export default meta;
type Story = StoryObj<typeof TasksView>;

export const Default: Story = {};

export const InsideAppShell: Story = {
  render: () => {
    const [activeRoute, setActiveRoute] = useState('tasks');
    const [search, setSearch] = useState('');

    return (
      <AppShell
        activeRoute={activeRoute}
        onNavigate={setActiveRoute}
        searchValue={search}
        onSearchChange={setSearch}
        userName="Alice Smith"
      >
        <TasksView />
      </AppShell>
    );
  },
};
