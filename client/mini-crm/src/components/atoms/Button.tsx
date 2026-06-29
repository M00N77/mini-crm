import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Spinner } from './Spinner';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-[var(--radius-md)] font-medium whitespace-nowrap transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--action-primary-bg)] text-[var(--text-inverse)] hover:bg-[var(--action-primary-hover)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--action-primary-bg)]',
        secondary:
          'bg-[var(--action-secondary-bg)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:bg-[var(--action-secondary-hover)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--border-strong)]',
        ghost:
          'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--action-secondary-bg)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--border-strong)]',
        danger:
          'bg-transparent text-[var(--color-danger)] border border-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-danger)]',
      },
      size: {
        sm: 'h-8 px-3 text-xs gap-1.5',
        md: 'h-10 px-4 text-sm gap-2',
        lg: 'h-12 px-6 text-base gap-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, iconLeft, iconRight, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), loading && 'pointer-events-none opacity-50', className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Spinner size="sm" />
        ) : iconLeft ? (
          <span className="flex [&_svg]:size-4 [&_svg]:shrink-0">{iconLeft}</span>
        ) : null}
        {children}
        {iconRight && <span className="flex [&_svg]:size-4 [&_svg]:shrink-0">{iconRight}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps };
