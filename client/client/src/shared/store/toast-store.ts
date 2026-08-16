import { create } from "zustand";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const DEFAULT_DURATION = 4000;
const MAX_TOASTS = 4;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (newToast) => {
    const id = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const toast: Toast = {
      ...newToast,
      id,
      duration: newToast.duration ?? DEFAULT_DURATION,
    };

    set((state) => {
      // Ограничиваем количество одновременных тостов
      const updated = [toast, ...state.toasts].slice(0, MAX_TOASTS);
      return { toasts: updated };
    });

    // Автоматическое удаление по таймеру
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, toast.duration);
    }

    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },
}));

export const toast = {
  success: (title: string, description?: string, duration?: number) =>
    useToastStore.getState().addToast({
      type: "success",
      title,
      description,
      duration,
    }),

  error: (title: string, description?: string, duration?: number) =>
    useToastStore.getState().addToast({
      type: "error",
      title,
      description,
      duration: duration ?? 5000,
    }),

  info: (title: string, description?: string, duration?: number) =>
    useToastStore.getState().addToast({
      type: "info",
      title,
      description,
      duration,
    }),

  warning: (title: string, description?: string, duration?: number) =>
    useToastStore.getState().addToast({
      type: "warning",
      title,
      description,
      duration,
    }),

  dismiss: (id: string) => useToastStore.getState().removeToast(id),
  clear: () => useToastStore.getState().clearToasts(),
};
