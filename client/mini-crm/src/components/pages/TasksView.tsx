import { FiPlus, FiMoreVertical } from 'react-icons/fi';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { Card } from '../molecules/Card';
import { Badge } from '../atoms/Badge';
import { KanbanColumn } from '../organisms/KanbanColumn';

type TaskStatus = 'Todo' | 'In Progress' | 'Done';

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

interface Column {
  id: string;
  title: TaskStatus;
  tasks: Task[];
}

interface TasksViewProps {
  columns?: Column[];
  onNewTask?: () => void;
}

const defaultColumns: Column[] = [
  {
    id: 'todo',
    title: 'Todo',
    tasks: [
      { id: 't1', title: 'Review Q3 budget proposal', description: 'Finalize numbers with accounting team', status: 'Todo' },
      { id: 't2', title: 'Update onboarding docs', description: 'Add new team member guidelines', status: 'Todo' },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [
      { id: 't3', title: 'Design system migration', description: 'Migrate Button and Input to new tokens', status: 'In Progress' },
      { id: 't4', title: 'API integration', description: 'Connect contacts endpoint', status: 'In Progress' },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [
      { id: 't5', title: 'User research interviews', description: 'Completed 12 sessions', status: 'Done' },
      { id: 't6', title: 'Logo redesign', description: 'New branding assets delivered', status: 'Done' },
    ],
  },
];

const statusVariantMap: Record<TaskStatus, 'info' | 'warning' | 'success'> = {
  Todo: 'info',
  'In Progress': 'warning',
  Done: 'success',
};

export function TasksView({ columns = defaultColumns, onNewTask }: TasksViewProps) {
  const totalTasks = columns.reduce((sum, col) => sum + col.tasks.length, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Section 1: Title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <Typography as="h1">Tasks</Typography>
        <Typography as="caption">What needs your attention</Typography>
      </div>

      {/* Section 2: Count + New Task */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography as="caption">{totalTasks} tasks across your board</Typography>
        <Button onClick={onNewTask} iconLeft={<FiPlus size={16} />}>
          New Task
        </Button>
      </div>

      {/* Section 3: Kanban Board */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--space-6)',
        }}
      >
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            title={col.title}
            count={col.tasks.length}
            variant={statusVariantMap[col.title]}
          >
            {col.tasks.map((task) => (
              <Card.Root key={task.id}>
                <Card.Content>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <FiMoreVertical
                      size={16}
                      style={{
                        flexShrink: 0,
                        color: 'var(--text-secondary)',
                        cursor: 'grab',
                        marginTop: 2,
                      }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-2)',
                        minWidth: 0,
                      }}
                    >
                      <span
                        style={{
                          color: 'var(--text-primary)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-semibold)',
                        }}
                      >
                        {task.title}
                      </span>
                      <span
                        style={{
                          color: 'var(--text-secondary)',
                          fontSize: 'var(--text-xs)',
                        }}
                      >
                        {task.description}
                      </span>
                      <Badge variant={statusVariantMap[task.status]}>
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                </Card.Content>
              </Card.Root>
            ))}
          </KanbanColumn>
        ))}
      </div>
    </div>
  );
}

export type { TasksViewProps };
export type { Task, Column, TaskStatus };
