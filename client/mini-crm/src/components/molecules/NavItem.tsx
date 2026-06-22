import { type ReactNode } from 'react';

interface NavItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function NavItem({ icon, label, active = false, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        width: '100%',
        padding: 'var(--space-2) var(--space-3)',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        background: active ? 'var(--action-secondary-bg)' : 'transparent',
        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
        fontSize: 'var(--text-sm)',
        fontWeight: active ? 'var(--font-medium)' : 'var(--font-normal)',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
      }}
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = 'var(--action-secondary-bg)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
