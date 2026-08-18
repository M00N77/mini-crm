"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./dialog";
import { Button } from "./button";
import { useModalStore } from "@/shared/store/modal-store";
import { AlertTriangle, HelpCircle } from "lucide-react";
import { cn } from "@/shared/lib";

export function ConfirmModal() {
  const { isOpen, type, data, closeModal } = useModalStore();
  const isModalOpen = isOpen && type === "confirmDelete";

  const [isLoading, setIsLoading] = useState(false);

  const title = data?.title || "Подтверждение действия";
  const description =
    data?.description || "Вы уверены, что хотите выполнить это действие?";
  const confirmText = data?.confirmText || "Подтвердить";
  const cancelText = data?.cancelText || "Отмена";
  const variant = (data?.variant as "destructive" | "default") || "destructive";

  const handleConfirm = async () => {
    if (data?.onConfirm) {
      try {
        setIsLoading(true);
        await data.onConfirm();
        closeModal();
      } catch (error) {
        console.error("Ошибка при выполнении подтверждения:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      closeModal();
    }
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        if (!open && !isLoading) {
          closeModal();
        }
      }}
    >
      <DialogContent className="sm:max-w-[440px] bg-surface border-border-subtle text-text-primary p-5">
        <div className="flex items-start gap-3.5">
          <div
            className={cn(
              "h-10 w-10 rounded-none flex items-center justify-center shrink-0 border",
              variant === "destructive"
                ? "bg-status-danger-bg text-status-danger border-status-danger-border"
                : "bg-accent-subtle text-accent border-accent-border"
            )}
          >
            {variant === "destructive" ? (
              <AlertTriangle className="h-4.5 w-4.5" />
            ) : (
              <HelpCircle className="h-4.5 w-4.5" />
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-1 pt-0.5">
            <DialogTitle className="text-sm font-bold text-text-primary">
              {title}
            </DialogTitle>
            <DialogDescription className="text-xs text-text-secondary leading-relaxed">
              {description}
            </DialogDescription>
          </div>
        </div>

        <DialogFooter className="pt-5 gap-2 sm:gap-2 font-mono text-xs">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={closeModal}
            className="text-xs"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            onClick={handleConfirm}
            className={cn(
              variant === "destructive"
                ? "bg-status-danger text-white hover:opacity-90 border-transparent"
                : "bg-accent text-accent-contrast hover:opacity-90 border-transparent",
              "text-xs font-semibold disabled:opacity-50"
            )}
          >
            {isLoading ? "Выполнение..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
