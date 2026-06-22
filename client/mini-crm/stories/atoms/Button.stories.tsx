import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../src/components/atoms/Button';
import { FiSearch, FiX } from 'react-icons/fi';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: 'primary', children: 'Sign In' } };
export const Secondary: Story = { args: { variant: 'secondary', children: 'Cancel' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'Settings' } };
export const Danger: Story = { args: { variant: 'danger', children: 'Delete' } };
export const Disabled: Story = { args: { variant: 'primary', children: 'Disabled', disabled: true } };
export const Loading: Story = { args: { variant: 'primary', children: 'Saving...', loading: true } };
export const WithIconLeft: Story = { args: { variant: 'primary', iconLeft: <FiSearch />, children: 'Search' } };
export const WithIconRight: Story = { args: { variant: 'secondary', children: 'Clear', iconRight: <FiX /> } };
export const Small: Story = { args: { variant: 'primary', size: 'sm', children: 'Small' } };
export const Large: Story = { args: { variant: 'primary', size: 'lg', children: 'Large' } };
