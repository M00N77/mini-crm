"use client";

import { Plus } from "lucide-react";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { useModalStore } from "@/shared/store/modal-store";

interface CreateNoteButtonProps {
  variant?: "default" | "fab" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  contactId?: number;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function CreateNoteButton({
  variant = "default",
  size = "sm",
  contactId,
  className,
  onClick,
  children,
}: CreateNoteButtonProps) {
  const { openModal } = useModalStore();

  const handleClick =
    onClick ||
    (() =>
      openModal("createNote", {
        contactId,
        defaultValues: contactId ? { contactId } : undefined,
      }));

  if (variant === "fab") {
    return (
      <button
        type="button"
        onClick={handleClick}
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

  const buttonVariant =
    variant === "outline"
      ? "outline"
      : variant === "ghost"
      ? "ghost"
      : "default";

  return (
    <Button
      type="button"
      onClick={handleClick}
      variant={buttonVariant}
      size={size}
      className={cn("gap-1.5 font-medium cursor-pointer shadow-xs", className)}
    >
      <Plus className="h-3.5 w-3.5 shrink-0" />
      <span>{children || "Добавить заметку"}</span>
    </Button>
  );
}
