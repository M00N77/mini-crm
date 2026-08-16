"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { Toast, ToastType, useToastStore } from "@/shared/store/toast-store";
import { cn } from "@/shared/lib";

interface ToastItemProps {
  toast: Toast;
}

const TOAST_ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  error: <AlertCircle className="h-4 w-4 text-error" />,
  info: <Info className="h-4 w-4 text-blue-500" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
};

const TOAST_ICON_CONTAINER: Record<ToastType, string> = {
  success: "bg-emerald-500/10 border-emerald-500/20",
  error: "bg-error-container/20 border-error/30",
  info: "bg-blue-500/10 border-blue-500/20",
  warning: "bg-amber-500/10 border-amber-500/20",
};

export function ToastItem({ toast }: ToastItemProps) {
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border border-outline-variant bg-surface-container-lowest p-3.5 shadow-lg shadow-black/10 select-none"
      role="alert"
    >
      {/* Icon Badge */}
      <div
        className={cn(
          "h-7 w-7 rounded-full flex items-center justify-center shrink-0 border mt-0.5",
          TOAST_ICON_CONTAINER[toast.type]
        )}
      >
        {TOAST_ICONS[toast.type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <h5 className="typo-body-sm font-semibold text-primary leading-tight">
          {toast.title}
        </h5>
        {toast.description && (
          <p className="typo-caption text-on-surface-variant text-xs leading-normal line-clamp-2">
            {toast.description}
          </p>
        )}
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={() => removeToast(toast.id)}
        aria-label="Закрыть уведомление"
        className="p-1 text-on-surface-variant/60 hover:text-primary rounded hover:bg-surface-container transition-colors shrink-0 cursor-pointer"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}
