import { cn } from "@/shared/lib";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export function Spinner({ size = "md", className, label }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-[3px]",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-primary border-t-transparent",
          sizeClasses[size]
        )}
        role="status"
        aria-label={label || "Загрузка"}
      />
      {label && (
        <span className="typo-caption text-on-surface-variant/70">
          {label}
        </span>
      )}
    </div>
  );
}
