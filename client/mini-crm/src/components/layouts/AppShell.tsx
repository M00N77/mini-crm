import { type ReactNode } from 'react';
import { Sidebar } from '../organisms/Sidebar';
import { Header } from '../organisms/Header';

interface AppShellProps {
  children: ReactNode;
  activeRoute: string;
  onNavigate: (route: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  userName?: string;
}

export function AppShell({
  children,
  activeRoute,
  onNavigate,
  searchValue,
  onSearchChange,
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
        activeRoute={activeRoute}
        onNavigate={onNavigate}
        userName={userName}
      />

      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', minWidth: 0 }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
          <Header
            searchValue={searchValue}
            onSearchChange={onSearchChange}
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
