import type { Meta, StoryObj } from '@storybook/react';
import { Header } from '../../src/components/organisms/Header';
import { useState } from 'react';

const meta: Meta<typeof Header> = {
  title: 'Organisms/Header',
  component: Header,
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  render: () => {
    const [search, setSearch] = useState('');
    return <Header searchValue={search} onSearchChange={setSearch} userName="Alice" />;
  },
};
