import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from '../../src/components/atoms/IconButton';
import { FiBell, FiSettings, FiX } from 'react-icons/fi';

const meta: Meta<typeof IconButton> = {
  title: 'Atoms/IconButton',
  component: IconButton,
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Bell: Story = { args: { icon: <FiBell size={20} />, label: 'Notifications' } };
export const Settings: Story = { args: { icon: <FiSettings size={20} />, label: 'Settings' } };
export const Close: Story = { args: { icon: <FiX size={20} />, label: 'Close' } };
