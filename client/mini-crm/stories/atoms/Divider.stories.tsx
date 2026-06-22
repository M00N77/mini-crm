import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from '../../src/components/atoms/Divider';
import { Typography } from '../../src/components/atoms/Typography';

const meta: Meta<typeof Divider> = {
  title: 'Atoms/Divider',
  component: Divider,
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = { args: {} };

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', height: 40 }}>
      <Typography as="p">Left</Typography>
      <Divider orientation="vertical" />
      <Typography as="p">Right</Typography>
    </div>
  ),
};
