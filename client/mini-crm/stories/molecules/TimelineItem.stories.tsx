import type { Meta, StoryObj } from '@storybook/react';
import { TimelineItem } from '../../src/components/molecules/TimelineItem';
import { Typography } from '../../src/components/atoms/Typography';

const meta: Meta<typeof TimelineItem> = {
  title: 'Molecules/TimelineItem',
  component: TimelineItem,
};

export default meta;
type Story = StoryObj<typeof TimelineItem>;

export const Default: Story = {
  args: {
    date: '2 hours ago',
    active: true,
    children: <Typography as="p">Called regarding project proposal</Typography>,
  },
};

export const Inactive: Story = {
  args: {
    date: 'Yesterday',
    active: false,
    children: <Typography as="p">Sent follow-up email</Typography>,
  },
};
