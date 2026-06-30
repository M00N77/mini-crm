import { type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Badge } from '../atoms/Badge';

const statCardVariants = cva(
  'flex flex-col gap-[var(--space-3)] rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-[var(--space-5)]',
  {
    variants: {},
    defaultVariants: {},
  }
);

interface StatCardProps extends VariantProps<typeof statCardVariants> {
  icon: ReactNode;
  label: string;
  value: number;
  delta: string;
  className?: string;
}

function StatCard({ icon, label, value, delta, className }: StatCardProps) {
  const isPositive = delta.startsWith('+');

  return (
    <div className={cn(statCardVariants(), className)}>
      <div className="flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--action-secondary-bg)] text-[var(--text-secondary)]">
          {icon}
        </div>
        <Badge variant={isPositive ? 'success' : 'error'}>{delta}</Badge>
      </div>
      <span className="text-[var(--text-primary)] text-[var(--text-3xl)] font-[var(--font-semibold)]">
        {value}
      </span>
      <span className="text-[var(--text-secondary)] text-[var(--text-sm)]">{label}</span>
    </div>
  );
}

export { StatCard, statCardVariants };
export type { StatCardProps };
