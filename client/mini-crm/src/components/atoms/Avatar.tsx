import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const avatarVariants = cva('rounded-full object-cover flex-shrink-0', {
  variants: {
    size: {
      sm: 'size-7 text-xs',
      md: 'size-9 text-sm',
      lg: 'size-11 text-base',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

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

interface AvatarProps extends VariantProps<typeof avatarVariants> {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function Avatar({ src, name, size, className }: AvatarProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className={cn(avatarVariants({ size }), className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0',
        avatarVariants({ size }),
        className
      )}
      style={{ backgroundColor: getColor(name) }}
    >
      {getInitials(name)}
    </div>
  );
}

export { Avatar };
export type { AvatarProps };
