import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from '../../src/components/molecules/Tabs';
import { useState } from 'react';

const meta: Meta<typeof Tabs> = {
  title: 'Molecules/Tabs',
  component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const tabs = [
  { id: 'signin', label: 'Sign In' },
  { id: 'create', label: 'Create Account' },
];

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('signin');
    return <Tabs tabs={tabs} activeTab={active} onChange={setActive} />;
  },
};
