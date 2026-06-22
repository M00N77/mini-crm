import { type ReactNode } from 'react';
import { Typography } from '../atoms/Typography';

interface TimelineItemProps {
  children: ReactNode;
  date: string;
  active?: boolean;
}

export function TimelineItem({ children, date, active = false }: TimelineItemProps) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 'var(--radius-full)',
            background: active ? 'var(--color-info)' : 'var(--border-strong)',
            flexShrink: 0,
            marginTop: 4,
          }}
        />
        <div style={{ width: 1, flex: 1, background: 'var(--border-subtle)', minHeight: 16 }} />
      </div>
      <div style={{ paddingBottom: 'var(--space-4)', flex: 1 }}>
        <div style={{ marginBottom: 'var(--space-1)' }}>{children}</div>
        <Typography as="caption">{date}</Typography>
      </div>
    </div>
  );
}
