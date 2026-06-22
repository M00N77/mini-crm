import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from '../../src/components/atoms/Typography';

const meta: Meta<typeof Typography> = {
  title: 'Atoms/Typography',
  component: Typography,
  argTypes: {
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'p', 'caption'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Heading1: Story = { args: { as: 'h1', children: 'Dashboard' } };
export const Heading2: Story = { args: { as: 'h2', children: 'Recent Contacts' } };
export const Heading3: Story = { args: { as: 'h3', children: 'Task Details' } };
export const Paragraph: Story = { args: { as: 'p', children: 'This is a paragraph of text used for descriptions and longer content.' } };
export const Caption: Story = { args: { as: 'caption', children: '2 hours ago' } };
