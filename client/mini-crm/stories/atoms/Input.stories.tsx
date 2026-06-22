import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../../src/components/atoms/Input';
import { FiMail, FiLock } from 'react-icons/fi';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { placeholder: 'Enter text...' } };
export const WithLabel: Story = { args: { label: 'Email', placeholder: 'you@example.com' } };
export const WithIcon: Story = { args: { label: 'Email', placeholder: 'you@example.com', iconLeft: <FiMail /> } };
export const WithError: Story = { args: { label: 'Password', type: 'password', iconLeft: <FiLock />, error: 'Password must be at least 8 characters' } };
export const Disabled: Story = { args: { label: 'Disabled', placeholder: 'Can\'t type', disabled: true } };
