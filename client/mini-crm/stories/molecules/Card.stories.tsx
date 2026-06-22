import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../../src/components/molecules/Card';
import { Typography } from '../../src/components/atoms/Typography';
import { Badge } from '../../src/components/atoms/Badge';
import { IconButton } from '../../src/components/atoms/IconButton';
import { FiMoreHorizontal } from 'react-icons/fi';

const meta: Meta<typeof Card.Root> = {
  title: 'Molecules/Card',
  component: Card.Root,
};

export default meta;
type Story = StoryObj<typeof Card.Root>;

export const Default: Story = {
  render: () => (
    <Card.Root style={{ maxWidth: 400 }}>
      <Card.Header>
        <Typography as="h3">Contact Details</Typography>
        <IconButton icon={<FiMoreHorizontal size={18} />} label="More" />
      </Card.Header>
      <Card.Content>
        <Typography as="p">Email: alice@example.com</Typography>
        <Typography as="p">Phone: +1 234 567 890</Typography>
      </Card.Content>
      <Card.Footer>
        <Badge variant="success">Active</Badge>
      </Card.Footer>
    </Card.Root>
  ),
};
