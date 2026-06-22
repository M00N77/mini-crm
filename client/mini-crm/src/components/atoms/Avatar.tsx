type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  src?: string;
  name: string;
  size?: AvatarSize;
}

const sizeMap: Record<AvatarSize, { dim: number; font: string }> = {
  sm: { dim: 28, font: 'var(--text-xs)' },
  md: { dim: 36, font: 'var(--text-sm)' },
  lg: { dim: 44, font: 'var(--text-base)' },
};

const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#14b8a6', '#f97316', '#06b6d4'];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({ src, name, size = 'md' }: AvatarProps) {
  const { dim, font } = sizeMap[size];
  const initials = getInitials(name);
  const bg = getColor(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        width={dim}
        height={dim}
        style={{ borderRadius: 'var(--radius-full)', objectFit: 'cover', flexShrink: 0 }}
      />
    );
  }

  return (
    <div
      style={{
        width: dim,
        height: dim,
        borderRadius: 'var(--radius-full)',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: font,
        fontWeight: 'var(--font-semibold)',
        color: '#fff',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}
