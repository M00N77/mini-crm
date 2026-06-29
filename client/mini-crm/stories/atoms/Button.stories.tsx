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

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Button variant="primary" size="sm">Small</Button>
        <Button variant="primary" size="md">Medium</Button>
        <Button variant="primary" size="lg">Large</Button>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Button variant="primary" loading>Loading</Button>
        <Button variant="primary" disabled>Disabled</Button>
        <Button variant="primary" iconLeft={<FiSearch />}>Icon Left</Button>
        <Button variant="secondary" iconRight={<FiX />}>Icon Right</Button>
      </div>
    </div>
  ),
};
