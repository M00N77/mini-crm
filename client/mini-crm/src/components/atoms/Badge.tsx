import { type ReactNode } from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  dot?: boolean;
  children: ReactNode;
}

const colorMap: Record<BadgeVariant, string> = {
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  error: 'var(--color-danger)',
  info: 'var(--color-info)',
};

export function Badge({ variant = 'info', dot = false, children }: BadgeProps) {
  const color = colorMap[variant];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        padding: '2px var(--space-2)',
        borderRadius: 'var(--radius-full)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-medium)',
        background: `${color}1A`,
        color,
        whiteSpace: 'nowrap',
      }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 'var(--radius-full)',
            background: color,
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
}
