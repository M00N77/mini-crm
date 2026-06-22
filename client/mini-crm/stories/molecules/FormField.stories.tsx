import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from '../../src/components/molecules/FormField';
import { Input } from '../../src/components/atoms/Input';

const meta: Meta<typeof FormField> = {
  title: 'Molecules/FormField',
  component: FormField,
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  args: { label: 'Email', children: <Input placeholder="you@example.com" /> },
};

export const WithError: Story = {
  args: { label: 'Password', error: 'Required', children: <Input type="password" error="Required" /> },
};
