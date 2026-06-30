import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from '../../src/components/organisms/Modal';
import { Button } from '../../src/components/atoms/Button';

const meta: Meta<typeof Modal> = {
  title: 'Organisms/Modal',
  component: Modal,
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Modal Title"
          description="This is a modal description."
        >
          <p className="text-[var(--text-secondary)] text-sm">
            Modal content goes here. You can put any React node inside.
          </p>
        </Modal>
      </>
    );
  },
};

export const Small: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Small Modal</Button>
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Small Modal"
          size="sm"
        >
          <p className="text-[var(--text-secondary)] text-sm">Compact modal for quick actions.</p>
        </Modal>
      </>
    );
  },
};

export const Medium: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Medium Modal</Button>
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Medium Modal"
          size="md"
        >
          <p className="text-[var(--text-secondary)] text-sm">Standard modal for most use cases.</p>
        </Modal>
      </>
    );
  },
};

export const Large: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Large Modal</Button>
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Large Modal"
          size="lg"
        >
          <p className="text-[var(--text-secondary)] text-sm">Spacious modal for complex content.</p>
        </Modal>
      </>
    );
  },
};

export const WithFooter: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal with Footer</Button>
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Confirm Action"
          description="Are you sure you want to proceed?"
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Confirm
              </Button>
            </>
          }
        >
          <p className="text-[var(--text-secondary)] text-sm">This action cannot be undone.</p>
        </Modal>
      </>
    );
  },
};
