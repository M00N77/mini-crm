import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type NotificationType = "contact" | "task" | "note" | "security" | "system";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string; // ISO string
  read: boolean;
  type: NotificationType;
}

interface NotificationState {
  notifications: NotificationItem[];
  addNotification: (
    item: Omit<NotificationItem, "id" | "timestamp" | "read"> & {
      id?: string;
      timestamp?: string;
      read?: boolean;
    }
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "welcome-1",
    title: "Добро пожаловать в Nexus CRM",
    description: "Система готова к работе. Управляйте контактами, задачами и заметками.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    type: "system",
  },
  {
    id: "welcome-2",
    title: "База контактов синхронизирована",
    description: "Загружены контакты и связанные компании из базы данных.",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    read: false,
    type: "contact",
  },
];

const MAX_NOTIFICATIONS = 30;

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: INITIAL_NOTIFICATIONS,

      addNotification: (item) => {
        const id =
          item.id ||
          (typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);

        const newNotification: NotificationItem = {
          id,
          title: item.title,
          description: item.description,
          timestamp: item.timestamp || new Date().toISOString(),
          read: item.read ?? false,
          type: item.type,
        };

        set((state) => {
          const updated = [newNotification, ...state.notifications].slice(
            0,
            MAX_NOTIFICATIONS
          );
          return { notifications: updated };
        });
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },

      clearAll: () => {
        set({ notifications: [] });
      },
    }),
    {
      name: "nexus-crm-notifications",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * Удобная функция добавления уведомления из любого места приложения
 */
export const notifyActivity = (
  title: string,
  description: string,
  type: NotificationType = "system"
) => {
  useNotificationStore.getState().addNotification({
    title,
    description,
    type,
  });
};
