import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from '../../src/components/organisms/Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Organisms/Sidebar',
  component: Sidebar,
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const ContactsActive: Story = { args: { activeRoute: 'contacts', onNavigate: () => {}, userName: 'Alice' } };
export const TasksActive: Story = { args: { activeRoute: 'tasks', onNavigate: () => {}, userName: 'Bob' } };
