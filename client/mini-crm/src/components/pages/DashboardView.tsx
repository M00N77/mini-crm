import { Fragment, type ReactNode } from 'react';
import { FiUsers, FiCheckSquare, FiCheckCircle, FiTrendingUp, FiPlus } from 'react-icons/fi';
import { Typography } from '../atoms/Typography';
import { Card } from '../molecules/Card';
import { StatCard } from '../molecules/StatCard';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { Avatar } from '../atoms/Avatar';
import { Divider } from '../atoms/Divider';

interface StatItem {
  label: string;
  value: number;
  delta: string;
}

interface ContactItem {
  id: string;
  name: string;
  role: string;
  company: string;
  lastActive: string;
}

interface PipelineItem {
  label: 'Todo' | 'In Progress' | 'Done';
  count: number;
}

interface UpNextItem {
  id: string;
  title: string;
}

interface DashboardViewProps {
  stats?: StatItem[];
  recentContacts?: ContactItem[];
  pipeline?: PipelineItem[];
  upNext?: UpNextItem[];
  taskValue?: string;
  onTaskChange?: (value: string) => void;
  onAddTask?: () => void;
}

const defaultStats: StatItem[] = [
  { label: 'Total Contacts', value: 248, delta: '+12%' },
  { label: 'Pending Tasks', value: 18, delta: '-3' },
  { label: 'Completed', value: 142, delta: '+8%' },
];

const defaultRecentContacts: ContactItem[] = [
  { id: '1', name: 'Alice Smith', role: 'CEO', company: 'Acme Inc', lastActive: '2 min ago' },
  { id: '2', name: 'Bob Johnson', role: 'Designer', company: 'Pixel Co', lastActive: '1 hour ago' },
  { id: '3', name: 'Carol Williams', role: 'Developer', company: 'Tech Corp', lastActive: '3 hours ago' },
  { id: '4', name: 'Dave Brown', role: 'Product Manager', company: 'Build Inc', lastActive: 'Yesterday' },
];

const defaultPipeline: PipelineItem[] = [
  { label: 'Todo', count: 12 },
  { label: 'In Progress', count: 8 },
  { label: 'Done', count: 24 },
];

const defaultUpNext: UpNextItem[] = [
  { id: '1', title: 'Review Q3 budget proposal' },
  { id: '2', title: 'Schedule team retro' },
  { id: '3', title: 'Update contact import script' },
];

function getStatIcon(label: string): ReactNode {
  switch (label) {
    case 'Total Contacts':
      return <FiUsers size={18} />;
    case 'Pending Tasks':
      return <FiCheckSquare size={18} />;
    case 'Completed':
      return <FiCheckCircle size={18} />;
    default:
      return <FiTrendingUp size={18} />;
  }
}

function getPipelineColor(label: string): string {
  switch (label) {
    case 'Todo':
      return 'var(--color-info)';
    case 'In Progress':
      return 'var(--color-warning)';
    case 'Done':
      return 'var(--color-success)';
    default:
      return 'var(--color-info)';
  }
}

export function DashboardView({
  stats = defaultStats,
  recentContacts = defaultRecentContacts,
  pipeline = defaultPipeline,
  upNext = defaultUpNext,
  taskValue = '',
  onTaskChange,
  onAddTask,
}: DashboardViewProps) {
  const pipelineTotal = pipeline.reduce((sum, item) => sum + item.count, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Section 1: Title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <Typography as="h1">Dashboard</Typography>
        <Typography as="caption">Your pipeline at a glance</Typography>
      </div>

      {/* Section 2: Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--space-4)',
        }}
      >
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            icon={getStatIcon(stat.label)}
            label={stat.label}
            value={stat.value}
            delta={stat.delta}
          />
        ))}
      </div>

      {/* Section 3: Quick Add + Pipeline */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--space-4)',
        }}
      >
        {/* Quick Add Task */}
        <Card.Root>
          <Card.Header>
            <Typography as="h3">Quick add task</Typography>
          </Card.Header>
          <Card.Content>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <Typography as="caption">
                Add a new task to your pipeline
              </Typography>
              <Input
                placeholder="Task title"
                value={taskValue}
                onChange={(e) => onTaskChange?.(e.target.value)}
              />
              <Button onClick={onAddTask} iconLeft={<FiPlus size={16} />}>
                Add task
              </Button>
            </div>
          </Card.Content>
        </Card.Root>

        {/* Task Pipeline */}
        <Card.Root>
          <Card.Header>
            <Typography as="h3">Task pipeline</Typography>
          </Card.Header>
          <Card.Content>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {pipeline.map((item) => (
                <div
                  key={item.label}
                  style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        color: 'var(--text-primary)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-medium)',
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: 'var(--text-sm)',
                      }}
                    >
                      {item.count}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 8,
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--bg-elevated)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${pipelineTotal > 0 ? (item.count / pipelineTotal) * 100 : 0}%`,
                        height: '100%',
                        borderRadius: 'var(--radius-full)',
                        background: getPipelineColor(item.label),
                        transition: 'width 0.2s ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card.Root>
      </div>

      {/* Section 4: Recent Contacts + Up Next */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--space-4)',
        }}
      >
        {/* Recent Contacts */}
        <Card.Root>
          <Card.Header>
            <Typography as="h3">Recent contacts</Typography>
          </Card.Header>
          <Card.Content>
            <div>
              {recentContacts.map((contact, i) => (
                <Fragment key={contact.id}>
                  {i > 0 && <Divider />}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-3)',
                      padding: 'var(--space-2) 0',
                    }}
                  >
                    <Avatar name={contact.name} size="sm" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          color: 'var(--text-primary)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-medium)',
                        }}
                      >
                        {contact.name}
                      </div>
                      <div
                        style={{
                          color: 'var(--text-secondary)',
                          fontSize: 'var(--text-xs)',
                        }}
                      >
                        {contact.role} &middot; {contact.company}
                      </div>
                    </div>
                    <span
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: 'var(--text-xs)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {contact.lastActive}
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
          </Card.Content>
        </Card.Root>

        {/* Up Next */}
        <Card.Root>
          <Card.Header>
            <Typography as="h3">Up next</Typography>
          </Card.Header>
          <Card.Content>
            <div>
              {upNext.map((item, i) => (
                <Fragment key={item.id}>
                  {i > 0 && <Divider />}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-3)',
                      padding: 'var(--space-3) 0',
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'var(--color-info)',
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        color: 'var(--text-primary)',
                        fontSize: 'var(--text-sm)',
                      }}
                    >
                      {item.title}
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
          </Card.Content>
        </Card.Root>
      </div>
    </div>
  );
}

export type { DashboardViewProps };
export type { StatItem, ContactItem, PipelineItem, UpNextItem };
