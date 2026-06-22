import { type ReactNode } from 'react';
import { Typography } from '../atoms/Typography';
import { Badge } from '../atoms/Badge';
import { Card } from '../molecules/Card';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info';

interface KanbanColumnProps {
  title: string;
  count: number;
  variant?: BadgeVariant;
  children: ReactNode;
}

export function KanbanColumn({ title, count, variant = 'info', children }: KanbanColumnProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        minWidth: 280,
        flex: 1,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: '0 var(--space-1)' }}>
        <Typography as="h3">{title}</Typography>
        <Badge variant={variant}>{count}</Badge>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {children}
      </div>
    </div>
  );
}

export function KanbanTask({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <Card.Root>
      <Card.Content>
        <Typography as="p">{title}</Typography>
        {children}
      </Card.Content>
    </Card.Root>
  );
}
