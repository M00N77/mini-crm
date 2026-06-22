import type { Meta, StoryObj } from '@storybook/react';
import { Drawer } from '../../src/components/organisms/Drawer';
import { useState } from 'react';
import { Button } from '../../src/components/atoms/Button';
import { Typography } from '../../src/components/atoms/Typography';

const meta: Meta<typeof Drawer> = {
  title: 'Organisms/Drawer',
  component: Drawer,
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <Drawer open={open} onClose={() => setOpen(false)} title="Contact Details">
          <Typography as="p">Email: alice@example.com</Typography>
          <Typography as="p">Phone: +1 234 567 890</Typography>
        </Drawer>
      </>
    );
  },
};
