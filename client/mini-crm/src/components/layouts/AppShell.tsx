import { type ReactNode } from 'react';
import { Sidebar } from '../organisms/Sidebar';
import { Header } from '../organisms/Header';

interface AppShellProps {
  children: ReactNode;
  userName?: string;
}

export function AppShell({
  children,
  userName,
}: AppShellProps) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--bg-base)',
      }}
    >
      <Sidebar
        userName={userName}
      />

      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', minWidth: 0 }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
          <Header
            userName={userName}
          />
        </div>

        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--space-8)',
            width: '100%',
            maxWidth: 1400,
            margin: '0 auto',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export type { AppShellProps };
