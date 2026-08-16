"use client";

import { Plus } from "lucide-react";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib";

interface CreateNoteButtonProps {
  variant?: "default" | "fab" | "outline" | "ghost";
  contactId?: number;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function CreateNoteButton({
  variant = "default",
  className,
  onClick,
  children,
}: CreateNoteButtonProps) {
  if (variant === "fab") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="Добавить заметку"
        className={cn(
          "fixed bottom-20 right-4 md:hidden z-30 h-12 w-12 rounded-full bg-primary text-on-primary shadow-lg flex items-center justify-center hover:opacity-90 active:scale-95 transition-all border border-outline",
          className
        )}
      >
        <Plus className="h-6 w-6" />
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
      <span>{children || "Добавить заметку"}</span>
    </Button>
  );
}
