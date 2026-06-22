interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
}

export function Divider({ orientation = 'horizontal' }: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        style={{
          width: 1,
          height: '100%',
          minHeight: 20,
          background: 'var(--border-subtle)',
          flexShrink: 0,
        }}
      />
    );
  }

  return <div style={{ height: 1, width: '100%', background: 'var(--border-subtle)', flexShrink: 0 }} />;
}
