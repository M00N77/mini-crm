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
      <DialogContent className="sm:max-w-[440px] bg-surface-container-lowest border-outline-variant text-on-surface p-6">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "h-11 w-11 rounded-full flex items-center justify-center shrink-0",
              variant === "destructive"
                ? "bg-error-container/20 text-error border border-error/30"
                : "bg-primary/10 text-primary border border-primary/20"
            )}
          >
            {variant === "destructive" ? (
              <AlertTriangle className="h-5 w-5" />
            ) : (
              <HelpCircle className="h-5 w-5" />
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-1.5 pt-0.5">
            <DialogTitle className="typo-body-lg font-semibold text-primary">
              {title}
            </DialogTitle>
            <DialogDescription className="typo-caption text-on-surface-variant leading-relaxed">
              {description}
            </DialogDescription>
          </div>
        </div>

        <DialogFooter className="pt-6 gap-2 sm:gap-2.5">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={closeModal}
            className="border-outline-variant text-on-surface hover:bg-surface-container font-medium"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            onClick={handleConfirm}
            className={cn(
              variant === "destructive"
                ? "bg-error text-on-error hover:opacity-90"
                : "bg-primary text-on-primary hover:opacity-90",
              "transition-all font-medium disabled:opacity-50"
            )}
          >
            {isLoading ? "Выполнение..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
