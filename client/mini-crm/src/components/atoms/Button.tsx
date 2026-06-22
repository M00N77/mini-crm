import { type ReactNode, type ButtonHTMLAttributes } from 'react';
import { Spinner } from './Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'var(--action-primary-bg)',
    color: 'var(--text-inverse)',
    border: 'none',
  },
  secondary: {
    background: 'var(--action-secondary-bg)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-subtle)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: 'none',
  },
  danger: {
    background: 'transparent',
    color: 'var(--color-danger)',
    border: '1px solid var(--color-danger)',
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: 'var(--space-1) var(--space-3)', fontSize: 'var(--text-sm)', gap: 'var(--space-1)' },
  md: { padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--text-base)', gap: 'var(--space-2)' },
  lg: { padding: 'var(--space-3) var(--space-6)', fontSize: 'var(--text-base)', gap: 'var(--space-2)' },
};

const baseStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 'var(--radius-md)',
  fontWeight: 'var(--font-medium)',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
  lineHeight: 1,
  whiteSpace: 'nowrap',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  iconLeft,
  iconRight,
  children,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const hoverStyle: React.CSSProperties = {};
  if (variant === 'primary') hoverStyle.background = 'var(--action-primary-hover)';
  if (variant === 'secondary') hoverStyle.background = 'var(--action-secondary-hover)';
  if (variant === 'ghost') hoverStyle.color = 'var(--text-primary)';
  if (variant === 'danger') hoverStyle.background = 'rgba(239, 68, 68, 0.1)';

  return (
    <button
      style={{
        ...baseStyle,
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...(disabled || loading ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
        ...style,
      }}
      disabled={disabled || loading}
      onMouseEnter={(e) => {
        if (!disabled && !loading) Object.assign(e.currentTarget.style, hoverStyle);
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.background = (variantStyles[variant].background as string) || '';
          e.currentTarget.style.color = (variantStyles[variant].color as string) || '';
        }
      }}
      {...rest}
    >
      {loading ? <Spinner size="sm" /> : iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
