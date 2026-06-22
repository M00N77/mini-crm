import { FiSearch } from 'react-icons/fi';
import { Input } from '../atoms/Input';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  hotkey?: string;
  placeholder?: string;
}

export function SearchInput({ value, onChange, hotkey = '⌘K', placeholder = 'Search...' }: SearchInputProps) {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      iconLeft={<FiSearch size={16} />}
      iconRight={
        hotkey ? (
          <kbd
            style={{
              fontSize: 'var(--text-xs)',
              padding: '1px 6px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              background: 'var(--bg-base)',
            }}
          >
            {hotkey}
          </kbd>
        ) : undefined
      }
    />
  );
}
