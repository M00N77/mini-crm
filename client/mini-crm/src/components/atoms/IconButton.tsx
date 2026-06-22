import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  size?: number;
}

export function IconButton({ icon, label, size = 20, style, ...rest }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: 'var(--radius-md)',
        border: 'none',
        background: 'transparent',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
        ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--action-secondary-bg)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
      {...rest}
    >
      {icon}
    </button>
  );
}
