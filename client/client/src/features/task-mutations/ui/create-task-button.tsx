"use client";

import { Plus } from "lucide-react";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib";

interface CreateTaskButtonProps {
  variant?: "default" | "fab" | "outline" | "ghost" | "header";
  status?: string;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function CreateTaskButton({
  variant = "default",
  className,
  onClick,
  children,
}: CreateTaskButtonProps) {
  if (variant === "fab") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="Создать задачу"
        className={cn(
          "fixed bottom-20 right-4 md:hidden z-30 h-12 w-12 rounded-full bg-primary text-on-primary shadow-lg flex items-center justify-center hover:opacity-90 active:scale-95 transition-all border border-outline",
          className
        )}
      >
        <Plus className="h-6 w-6" />
      </button>
    );
  }

  if (variant === "header") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex items-center gap-2 bg-primary text-on-primary px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity typo-body-sm font-medium cursor-pointer shadow-sm",
          className
        )}
      >
        <Plus className="h-4 w-4 shrink-0" />
        <span>{children || "Create Task"}</span>
        <kbd className="hidden sm:inline-block font-label-mono text-[10px] text-on-primary-container bg-surface-container-low px-1.5 py-0.5 rounded border border-outline-variant ml-1">
          ⌘N
        </kbd>
      </button>
    );
  }

  return (
    <Button
      type="button"
      onClick={onClick}
      variant={variant === "outline" ? "outline" : "default"}
      className={cn(
        "bg-primary text-on-primary hover:opacity-90 transition-opacity typo-body-sm font-medium rounded px-4 py-1.5 flex items-center gap-2 cursor-pointer",
        className
      )}
    >
      <Plus className="h-4 w-4 shrink-0" />
      <span>{children || "Новая задача"}</span>
    </Button>
  );
}
