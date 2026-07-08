import type { Meta, StoryObj } from '@storybook/react';
import { ContactDrawer } from '../../app/components/ContactDrawer';

const meta: Meta<typeof ContactDrawer> = {
  title: 'App/ContactDrawer',
  component: ContactDrawer,
};

export default meta;
type Story = StoryObj<typeof ContactDrawer>;

const mockNotes = [
  { text: 'Initial outreach completed, positive response — wants to see a demo', timeAgo: '2 days ago' },
  { text: 'Follow-up call scheduled for next Thursday', timeAgo: '1 hour ago' },
];

export const WithNotes: Story = {
  args: {
    name: 'Ava Mercer',
    role: 'Head of Growth',
    company: 'Northwind',
    email: 'ava@northwind.io',
    phone: '+1 415 552-0188',
    notes: mockNotes,
  },
};

export const NoNotes: Story = {
  args: {
    name: 'Diego Santos',
    role: 'Sales Manager',
    company: 'Lumeworks',
    email: 'diego@lumeworks.io',
    phone: '+1 415 555-0102',
    notes: [],
  },
};
