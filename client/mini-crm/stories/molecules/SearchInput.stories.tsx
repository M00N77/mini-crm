import type { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from '../../src/components/molecules/SearchInput';
import { useState } from 'react';

const meta: Meta<typeof SearchInput> = {
  title: 'Molecules/SearchInput',
  component: SearchInput,
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  render: () => {
    const [val, setVal] = useState('');
    return <SearchInput value={val} onChange={setVal} />;
  },
};

export const WithoutHotkey: Story = {
  render: () => {
    const [val, setVal] = useState('');
    return <SearchInput value={val} onChange={setVal} hotkey="" />;
  },
};
