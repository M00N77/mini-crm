import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from '../../src/components/atoms/Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Atoms/Toggle',
  component: Toggle,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

const ToggleWithState = ({
  defaultChecked = false,
  ...args
}: Omit<React.ComponentProps<typeof Toggle>, 'checked' | 'onChange'> & {
  defaultChecked?: boolean;
}) => {
  const [checked, setChecked] = useState(defaultChecked);
  return <Toggle {...args} checked={checked} onChange={setChecked} />;
};

export const Off: Story = {
  render: () => <ToggleWithState />,
};

export const On: Story = {
  render: () => <ToggleWithState defaultChecked />,
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <ToggleWithState label="Disabled off" disabled />
      <ToggleWithState label="Disabled checked" disabled defaultChecked />
    </div>
  ),
};

export const WithLabelAndDescription: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <ToggleWithState label="Enable notifications" description="Receive push alerts for new messages" />
      <ToggleWithState
        label="Dark mode"
        description="Use dark theme across the app"
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <ToggleWithState label="Small toggle" size="sm" />
      <ToggleWithState label="Medium toggle" size="md" description="Default size" />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontWeight: 600 }}>States</span>
        <ToggleWithState label="Unchecked" />
        <ToggleWithState label="Checked" />
        <ToggleWithState label="With description" description="This is a helpful hint" />
        <ToggleWithState label="Disabled unchecked" disabled />
        <ToggleWithState label="Disabled checked" disabled />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontWeight: 600 }}>Sizes</span>
        <ToggleWithState label="Small (sm)" size="sm" />
        <ToggleWithState label="Medium (md)" size="md" />
      </div>
    </div>
  ),
};
