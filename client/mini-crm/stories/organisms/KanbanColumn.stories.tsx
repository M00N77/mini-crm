import type { Meta, StoryObj } from '@storybook/react';
import { KanbanColumn, KanbanTask } from '../../src/components/organisms/KanbanColumn';

const meta: Meta<typeof KanbanColumn> = {
  title: 'Organisms/KanbanColumn',
  component: KanbanColumn,
};

export default meta;
type Story = StoryObj<typeof KanbanColumn>;

export const Default: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      <KanbanColumn title="To Do" count={3} variant="info">
        <KanbanTask title="Design login page" />
        <KanbanTask title="Setup database" />
        <KanbanTask title="Write API docs" />
      </KanbanColumn>
      <KanbanColumn title="In Progress" count={2} variant="warning">
        <KanbanTask title="Implement auth" />
        <KanbanTask title="Create contact form" />
      </KanbanColumn>
      <KanbanColumn title="Done" count={4} variant="success">
        <KanbanTask title="Project setup" />
        <KanbanTask title="Design system" />
      </KanbanColumn>
    </div>
  ),
};
