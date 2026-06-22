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
