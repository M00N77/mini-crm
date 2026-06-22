import type { Meta, StoryObj } from '@storybook/react';
import { NavItem } from '../../src/components/molecules/NavItem';
import { FiUsers, FiCheckSquare, FiSettings } from 'react-icons/fi';

const meta: Meta<typeof NavItem> = {
  title: 'Molecules/NavItem',
  component: NavItem,
};

export default meta;
type Story = StoryObj<typeof NavItem>;

export const Contacts: Story = { args: { icon: <FiUsers size={18} />, label: 'Contacts', active: true } };
export const Tasks: Story = { args: { icon: <FiCheckSquare size={18} />, label: 'Tasks' } };
export const Settings: Story = { args: { icon: <FiSettings size={18} />, label: 'Settings' } };
