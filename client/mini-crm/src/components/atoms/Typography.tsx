import { type ReactNode } from 'react';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'p' | 'caption';

interface TypographyProps {
  as?: TypographyVariant;
  children: ReactNode;
}

const styles: Record<TypographyVariant, React.CSSProperties> = {
  h1: {
    fontSize: 'var(--text-3xl)',
    fontWeight: 'var(--font-semibold)',
    lineHeight: 1.25,
    letterSpacing: '-0.025em',
    color: 'var(--text-primary)',
  },
  h2: {
    fontSize: 'var(--text-xl)',
    fontWeight: 'var(--font-semibold)',
    lineHeight: 1.3,
    color: 'var(--text-primary)',
  },
  h3: {
    fontSize: 'var(--text-lg)',
    fontWeight: 'var(--font-medium)',
    lineHeight: 1.4,
    color: 'var(--text-primary)',
  },
  p: {
    fontSize: 'var(--text-base)',
    fontWeight: 'var(--font-normal)',
    lineHeight: 1.5,
    color: 'var(--text-primary)',
  },
  caption: {
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-normal)',
    lineHeight: 1.4,
    color: 'var(--text-secondary)',
  },
};

export function Typography({ as = 'p', children }: TypographyProps) {
  const Tag = as === 'caption' ? 'span' : as;
  return <Tag style={styles[as]}>{children}</Tag>;
}
