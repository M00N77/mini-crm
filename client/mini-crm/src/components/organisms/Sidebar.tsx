'use client'
import { FiGrid, FiUsers, FiCheckSquare, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { NavItem } from '../molecules/NavItem';
import { Avatar } from '../atoms/Avatar';
import { Divider } from '../atoms/Divider';
import { Typography } from '../atoms/Typography';
import { IconButton } from '../atoms/IconButton';
import { useAuth } from '@/src/context/AuthProvider';

interface SidebarProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
  userName?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

const navItems = [
  { id: 'dashboard', icon: <FiGrid size={18} />, label: 'Dashboard' },
  { id: 'contacts', icon: <FiUsers size={18} />, label: 'Contacts' },
  { id: 'tasks', icon: <FiCheckSquare size={18} />, label: 'Tasks' },
  { id: 'settings', icon: <FiSettings size={18} />, label: 'Settings' },
];

export function Sidebar({ activeRoute, onNavigate, userName = 'User', isOpen = true, onToggle }: SidebarProps) {
  const { logout } = useAuth();
  const router = useRouter();
  return (
    <>
      {onToggle && !isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 md:hidden flex items-center justify-center size-10 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--action-secondary-bg)]"
          aria-label="Open sidebar"
        >
          <FiMenu size={20} />
        </button>
      )}

      {onToggle && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 transition-transform duration-200`}
        style={{
          width: 240,
          height: '100vh',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          padding: 'var(--space-4)',
          gap: 'var(--space-1)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-2) var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <Typography as="h3">Mini CRM</Typography>
          {onToggle && (
            <IconButton icon={<FiX size={20} />} label="Close sidebar" onClick={onToggle} className="md:hidden" />
          )}
        </div>

      {navItems.map((item) => (
        <NavItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          active={activeRoute === item.id}
          onClick={() => onNavigate(item.id)}
        />
      ))}

      <div style={{ flex: 1 }} />

      <Divider />
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)' }}>
        <Avatar name={userName} size="sm" />
        <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{userName}</span>
        <button
          onClick={async () => { await logout(); router.replace('/login'); }}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
          title="Sign out"
        >
          <FiLogOut size={16} />
        </button>
      </div>
    </aside>
    </>
  );
}
