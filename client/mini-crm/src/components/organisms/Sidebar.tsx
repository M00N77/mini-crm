import { FiUsers, FiCheckSquare, FiSettings, FiLogOut } from 'react-icons/fi';
import { NavItem } from '../molecules/NavItem';
import { Avatar } from '../atoms/Avatar';
import { Divider } from '../atoms/Divider';
import { Typography } from '../atoms/Typography';

interface SidebarProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
  userName?: string;
}

const navItems = [
  { id: 'contacts', icon: <FiUsers size={18} />, label: 'Contacts' },
  { id: 'tasks', icon: <FiCheckSquare size={18} />, label: 'Tasks' },
  { id: 'settings', icon: <FiSettings size={18} />, label: 'Settings' },
];

export function Sidebar({ activeRoute, onNavigate, userName = 'User' }: SidebarProps) {
  return (
    <aside
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
      <div style={{ padding: 'var(--space-2) var(--space-3)', marginBottom: 'var(--space-4)' }}>
        <Typography as="h3">Mini CRM</Typography>
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
          onClick={() => {}}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
          title="Sign out"
        >
          <FiLogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
