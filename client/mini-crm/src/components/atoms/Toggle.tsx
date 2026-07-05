import { cn } from '../../lib/utils';
import type { FC } from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

const Toggle: FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
}) => {
  const isSm = size === 'sm';

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div
      className={cn(
        'inline-flex items-start gap-3',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      )}
      onClick={handleToggle}
      role="presentation"
    >
      <button
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleToggle();
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative inline-flex shrink-0 rounded-full transition-colors duration-200 motion-reduce:transition-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-success)]',
          isSm ? 'h-5 w-9' : 'h-6 w-11',
          checked
            ? 'bg-[var(--color-success)]'
            : 'bg-[var(--bg-elevated)] border border-[var(--border-strong)]',
          !disabled && 'hover:opacity-80',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 bg-white rounded-full shadow-sm transition-transform duration-200 motion-reduce:transition-none',
            isSm ? 'h-4 w-4' : 'h-5 w-5',
            checked && (isSm ? 'translate-x-4' : 'translate-x-5'),
          )}
        />
      </button>
      {(label || description) && (
        <div className="flex flex-col gap-0.5 pt-px">
          {label && (
            <span className="text-sm font-medium text-[var(--text-primary)] select-none">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-[var(--text-secondary)] select-none">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

Toggle.displayName = 'Toggle';

export { Toggle };
export type { ToggleProps };
