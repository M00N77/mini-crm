import { FiBell } from 'react-icons/fi';
import { SearchInput } from '../molecules/SearchInput';
import { IconButton } from '../atoms/IconButton';
import { Avatar } from '../atoms/Avatar';

interface HeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  userName?: string;
}

export function Header({ searchValue, onSearchChange, userName = 'User' }: HeaderProps) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        padding: 'var(--space-3) var(--space-5)',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-base)',
      }}
    >
      <div style={{ flex: 1, maxWidth: 360 }}>
        <SearchInput value={searchValue} onChange={onSearchChange} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
        <IconButton icon={<FiBell size={20} />} label="Notifications" />
        <Avatar name={userName} size="sm" />
      </div>
    </header>
  );
}
