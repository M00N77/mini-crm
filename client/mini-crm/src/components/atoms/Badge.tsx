import { type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
  {
    variants: {
      variant: {
        success: 'bg-[var(--color-success)]/10 text-[var(--color-success)]',
        warning: 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]',
        error: 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]',
        info: 'bg-[var(--color-info)]/10 text-[var(--color-info)]',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  variant?: 'success' | 'warning' | 'error' | 'info';
  dot?: boolean;
  children: ReactNode;
  className?: string;
}

function Badge({ variant, dot = false, children, className }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      {dot && <span className="size-1.5 rounded-full bg-current flex-shrink-0" />}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };
