import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const iconButtonVariants = cva(
  'inline-flex items-center justify-center rounded-[var(--radius-md)] text-[var(--text-secondary)] transition-all duration-150 hover:bg-[var(--action-secondary-bg)] hover:text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--border-strong)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'size-8 [&_svg]:size-4',
        md: 'size-9 [&_svg]:size-5',
        lg: 'size-10 [&_svg]:size-6',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  icon: ReactNode;
  label: string;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, size, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-label={label}
        title={label}
        className={cn(iconButtonVariants({ size }), className)}
        {...props}
      >
        {icon}
      </button>
    );
  }
);
IconButton.displayName = 'IconButton';

export { IconButton, iconButtonVariants };
export type { IconButtonProps };
