import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '../../src/components/atoms/Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Initials: Story = { args: { name: 'Alice Miller', size: 'md' } };
export const SingleInitial: Story = { args: { name: 'John', size: 'md' } };
export const Small: Story = { args: { name: 'Bob Smith', size: 'sm' } };
export const Large: Story = { args: { name: 'Catherine Jones', size: 'lg' } };
export const WithImage: Story = { args: { name: 'Demo User', size: 'md', src: 'https://i.pravatar.cc/150?u=demo' } };

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Avatar name="Alice Miller" size="sm" />
      <Avatar name="Alice Miller" size="md" />
      <Avatar name="Alice Miller" size="lg" />
    </div>
  ),
};

export const ColorVariety: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar name="Alice Miller" />
      <Avatar name="Bob Smith" />
      <Avatar name="Catherine Jones" />
      <Avatar name="David Brown" />
      <Avatar name="Eve Davis" />
      <Avatar name="Frank Wilson" />
      <Avatar name="Grace Lee" />
    </div>
  ),
};
