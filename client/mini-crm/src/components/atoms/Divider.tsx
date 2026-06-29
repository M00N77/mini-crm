import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const dividerVariants = cva('flex-shrink-0 bg-[var(--border-subtle)]', {
  variants: {
    orientation: {
      horizontal: 'h-px w-full',
      vertical: 'w-px h-full min-h-5',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

interface DividerProps extends VariantProps<typeof dividerVariants> {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

function Divider({ orientation, className }: DividerProps) {
  return <div className={cn(dividerVariants({ orientation }), className)} />;
}

export { Divider, dividerVariants };
export type { DividerProps };
