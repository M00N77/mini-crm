import { type ReactNode } from 'react';
import { Divider } from '../atoms/Divider';

function Root({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Header({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ padding: 'var(--space-4) var(--space-5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...style }}>
      {children}
    </div>
  );
}

function Content({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return <div style={{ padding: '0 var(--space-5) var(--space-5)', ...style }}>{children}</div>;
}

function Footer({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <>
      <Divider />
      <div style={{ padding: 'var(--space-3) var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', ...style }}>
        {children}
      </div>
    </>
  );
}

export const Card = { Root, Header, Content, Footer };
