import { cn } from "@/shared/lib";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-none bg-subtle/80 border border-border-subtle/40",
        className
      )}
      {...props}
    />
  );
}
