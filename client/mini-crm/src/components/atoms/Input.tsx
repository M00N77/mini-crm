import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, iconLeft, iconRight, style, ...rest }, ref) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        {label && (
          <label style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: 'var(--font-medium)' }}>
            {label}
          </label>
        )}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {iconLeft && (
            <span style={{ position: 'absolute', left: 12, color: 'var(--text-secondary)', display: 'flex' }}>
              {iconLeft}
            </span>
          )}
          <input
            ref={ref}
            style={{
              width: '100%',
              padding: 'var(--space-2) var(--space-3)',
              paddingLeft: iconLeft ? 40 : 'var(--space-3)',
              paddingRight: iconRight ? 40 : 'var(--space-3)',
              background: 'var(--bg-surface)',
              border: `1px solid ${error ? 'var(--color-danger)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)',
              lineHeight: 1.5,
              outline: 'none',
              transition: 'border-color var(--transition-fast)',
              ...style,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = error ? 'var(--color-danger)' : 'var(--border-strong)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = error ? 'var(--color-danger)' : 'var(--border-subtle)';
            }}
            {...rest}
          />
          {iconRight && (
            <span style={{ position: 'absolute', right: 12, color: 'var(--text-secondary)', display: 'flex' }}>
              {iconRight}
            </span>
          )}
        </div>
        {error && (
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-danger)' }}>{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
