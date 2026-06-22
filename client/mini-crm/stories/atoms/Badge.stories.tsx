import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../../src/components/atoms/Badge';

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  argTypes: {
    variant: { control: 'select', options: ['success', 'warning', 'error', 'info'] },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Success: Story = { args: { variant: 'success', children: 'Completed' } };
export const Warning: Story = { args: { variant: 'warning', children: 'In Progress' } };
export const Error: Story = { args: { variant: 'error', children: 'Overdue' } };
export const Info: Story = { args: { variant: 'info', children: 'Pending' } };
export const WithDot: Story = { args: { variant: 'success', dot: true, children: 'Online' } };
export const TrendUp: Story = { args: { variant: 'success', children: '+12%' } };
