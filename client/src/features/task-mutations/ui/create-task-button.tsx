"use client";

import { Plus } from "lucide-react";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { useModalStore } from "@/shared/store/modal-store";

interface CreateTaskButtonProps {
  variant?: "default" | "fab" | "outline" | "ghost" | "header";
  size?: "default" | "sm" | "lg" | "icon";
  status?: string;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function CreateTaskButton({
  variant = "default",
  size = "sm",
  status,
  className,
  onClick,
  children,
}: CreateTaskButtonProps) {
  const { openModal } = useModalStore();

  const handleClick =
    onClick ||
    (() =>
      openModal("createTask", {
        defaultValues: status ? { status } : undefined,
      }));

  if (variant === "fab") {
    return (
      <button
        type="button"
        onClick={handleClick}
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
      <span>{children || "Создать задачу"}</span>
      {variant === "header" && (
        <kbd className="hidden sm:inline-block font-label-mono text-[10px] text-on-primary font-semibold bg-black/10 px-1.5 py-0.5 rounded border border-black/15 ml-0.5">
          ⌘N
        </kbd>
      )}
    </Button>
  );
}
