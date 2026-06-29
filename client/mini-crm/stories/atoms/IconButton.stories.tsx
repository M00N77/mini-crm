import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from '../../src/components/atoms/IconButton';
import { FiBell, FiSettings, FiX, FiSearch, FiTrash2 } from 'react-icons/fi';

const meta: Meta<typeof IconButton> = {
  title: 'Atoms/IconButton',
  component: IconButton,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Bell: Story = { args: { icon: <FiBell />, label: 'Notifications' } };
export const Settings: Story = { args: { icon: <FiSettings />, label: 'Settings' } };
export const Close: Story = { args: { icon: <FiX />, label: 'Close' } };

export const Small: Story = { args: { icon: <FiSearch />, label: 'Search', size: 'sm' } };
export const Large: Story = { args: { icon: <FiTrash2 />, label: 'Delete', size: 'lg' } };
export const Disabled: Story = { args: { icon: <FiBell />, label: 'Notifications', disabled: true } };

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <IconButton icon={<FiBell />} label="Notifications" />
      <IconButton icon={<FiSettings />} label="Settings" />
      <IconButton icon={<FiX />} label="Close" />
      <IconButton icon={<FiSearch />} label="Search" size="sm" />
      <IconButton icon={<FiTrash2 />} label="Delete" size="lg" />
      <IconButton icon={<FiBell />} label="Disabled" disabled />
    </div>
  ),
};
