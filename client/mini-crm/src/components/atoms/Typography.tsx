import { type ReactNode, type ElementType } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'text-3xl font-semibold tracking-tight text-[var(--text-primary)]',
      h2: 'text-xl font-semibold text-[var(--text-primary)]',
      h3: 'text-lg font-medium text-[var(--text-primary)]',
      p: 'text-base font-normal text-[var(--text-primary)]',
      caption: 'text-sm font-normal text-[var(--text-secondary)]',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
});

type Variant = 'h1' | 'h2' | 'h3' | 'p' | 'caption';

interface TypographyProps extends VariantProps<typeof typographyVariants> {
  as?: Variant;
  children: ReactNode;
  className?: string;
}

function Typography({ as = 'p', children, className }: TypographyProps) {
  const Comp: ElementType = as === 'caption' ? 'span' : as;
  return <Comp className={cn(typographyVariants({ variant: as }), className)}>{children}</Comp>;
}

export { Typography, typographyVariants };
export type { TypographyProps };
