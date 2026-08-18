"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { Toast, ToastType, useToastStore } from "@/shared/store/toast-store";
import { cn } from "@/shared/lib";

interface ToastItemProps {
  toast: Toast;
}

const TOAST_ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="h-3.5 w-3.5 text-status-success" />,
  error: <AlertCircle className="h-3.5 w-3.5 text-status-danger" />,
  info: <Info className="h-3.5 w-3.5 text-status-info" />,
  warning: <AlertTriangle className="h-3.5 w-3.5 text-status-warning" />,
};

const TOAST_ICON_CONTAINER: Record<ToastType, string> = {
  success: "bg-status-success-bg border-status-success-border",
  error: "bg-status-danger-bg border-status-danger-border",
  info: "bg-subtle border-border-subtle",
  warning: "bg-accent-subtle border-accent-border",
};

export function ToastItem({ toast }: ToastItemProps) {
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-none border border-border-strong bg-surface p-3 shadow-xl shadow-black/20 select-none"
      role="alert"
    >
      {/* Icon Badge */}
      <div
        className={cn(
          "h-6 w-6 rounded-none flex items-center justify-center shrink-0 border mt-0.5",
          TOAST_ICON_CONTAINER[toast.type]
        )}
      >
        {TOAST_ICONS[toast.type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-0.5 font-sans">
        <h5 className="text-xs font-semibold text-text-primary leading-tight">
          {toast.title}
        </h5>
        {toast.description && (
          <p className="text-[11px] text-text-secondary leading-normal line-clamp-2">
            {toast.description}
          </p>
        )}
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={() => removeToast(toast.id)}
        aria-label="Закрыть уведомление"
        className="p-1 text-text-tertiary hover:text-text-primary rounded-none hover:bg-subtle transition-colors shrink-0 cursor-pointer"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}
