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

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Typography as="p">Horizontal divider below:</Typography>
        <Divider orientation="horizontal" />
        <Typography as="p">Content after divider</Typography>
      </div>
      <div>
        <Typography as="p">Vertical divider between items:</Typography>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 40, marginTop: 8 }}>
          <Typography as="p">Left</Typography>
          <Divider orientation="vertical" />
          <Typography as="p">Center</Typography>
          <Divider orientation="vertical" />
          <Typography as="p">Right</Typography>
        </div>
      </div>
    </div>
  ),
};
