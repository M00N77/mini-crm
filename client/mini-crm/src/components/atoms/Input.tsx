import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, iconLeft, iconRight, className, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm text-[var(--text-secondary)] font-medium">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {iconLeft && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] flex [&_svg]:size-4">
              {iconLeft}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            aria-invalid={!!error}
            className={cn(
              'flex h-10 w-full rounded-[var(--radius-md)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]',
              'border border-[var(--border-subtle)] transition-colors duration-150',
              'focus:outline-none focus:border-[var(--border-strong)]',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-[var(--color-danger)] focus:border-[var(--color-danger)]',
              iconLeft && 'pl-10',
              iconRight && 'pr-10',
              className
            )}
            {...props}
          />
          {iconRight && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] flex [&_svg]:size-4">
              {iconRight}
            </span>
          )}
        </div>
        {error && <span className="text-xs text-[var(--color-danger)]">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
export type { InputProps };
