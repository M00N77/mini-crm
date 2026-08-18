"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCheck,
  Trash2,
  UserPlus,
  CheckSquare,
  StickyNote,
  ShieldCheck,
  Info,
  Sparkles,
} from "lucide-react";
import {
  useNotificationStore,
  NotificationItem,
  NotificationType,
} from "@/shared/store/notification-store";
import { cn } from "@/shared/lib";

const TYPE_ICONS: Record<NotificationType, React.ReactNode> = {
  contact: <UserPlus className="h-3.5 w-3.5 text-blue-500" />,
  task: <CheckSquare className="h-3.5 w-3.5 text-emerald-500" />,
  note: <StickyNote className="h-3.5 w-3.5 text-purple-500" />,
  security: <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />,
  system: <Info className="h-3.5 w-3.5 text-primary" />,
};

const TYPE_CONTAINER: Record<NotificationType, string> = {
  contact: "bg-blue-500/10 border-blue-500/20",
  task: "bg-emerald-500/10 border-emerald-500/20",
  note: "bg-purple-500/10 border-purple-500/20",
  security: "bg-amber-500/10 border-amber-500/20",
  system: "bg-accent-subtle border-accent-border",
};

function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffInMinutes < 1) return "только что";
  if (diffInMinutes < 60) return `${diffInMinutes} мин назад`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} ч назад`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} дн назад`;

  return new Date(dateString).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}

export function NotificationsPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const notifications = useNotificationStore((state) => state.notifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const clearAll = useNotificationStore((state) => state.clearAll);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  // Закрытие при клике вне поповера
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = (item: NotificationItem) => {
    if (!item.read) {
      markAsRead(item.id);
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Кнопка с колокольчиком */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Уведомления"
        title="Уведомления"
        className="text-text-secondary hover:text-text-primary transition-colors p-1.5 rounded-none hover:bg-subtle relative cursor-pointer group"
      >
        <Bell className="h-4.5 w-4.5 transition-transform group-hover:scale-105" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-danger opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-status-danger" />
          </span>
        )}
      </button>

      {/* Выпадающее окно уведомлений */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-none border border-border-strong bg-surface shadow-2xl shadow-black/30 z-50 overflow-hidden select-none"
          >
            {/* Шапка уведомлений */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-subtle">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-semibold text-text-primary">
                  Уведомления
                </h4>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-semibold text-accent bg-accent-subtle border border-accent-border px-1.5 py-0.2 rounded-none font-mono">
                    {unreadCount} новых
                  </span>
                )}
              </div>

              {/* Кнопки действий */}
              <div className="flex items-center gap-1 font-mono">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    title="Прочитать все"
                    className="p-1 text-text-tertiary hover:text-text-primary rounded-none hover:bg-surface transition-colors cursor-pointer"
                  >
                    <CheckCheck className="h-4 w-4" />
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    title="Очистить список"
                    className="p-1 text-text-tertiary hover:text-status-danger rounded-none hover:bg-surface transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Список уведомлений */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-border-subtle">
              {notifications.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center p-6 text-text-tertiary font-mono">
                  <div className="h-10 w-10 rounded-none bg-subtle border border-border-subtle flex items-center justify-center mb-2 text-text-tertiary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold text-text-primary">
                    // ВСЕ СПОКОЙНО
                  </p>
                  <p className="text-[11px] text-text-tertiary mt-0.5">
                    Новых уведомлений и событий нет
                  </p>
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      "p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-subtle/60",
                      !item.read && "bg-accent-subtle/30"
                    )}
                  >
                    {/* Badge Icon */}
                    <div
                      className={cn(
                        "h-7 w-7 rounded-none flex items-center justify-center shrink-0 border mt-0.5",
                        TYPE_CONTAINER[item.type]
                      )}
                    >
                      {TYPE_ICONS[item.type]}
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0 space-y-0.5 font-sans">
                      <div className="flex items-center justify-between gap-2">
                        <h5
                          className={cn(
                            "text-xs truncate leading-tight",
                            item.read
                              ? "font-medium text-text-primary"
                              : "font-semibold text-text-primary"
                          )}
                        >
                          {item.title}
                        </h5>
                        <span className="text-[10px] text-text-tertiary font-mono shrink-0">
                          {formatRelativeTime(item.timestamp)}
                        </span>
                      </div>
                      <p className="text-text-secondary text-[11px] leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Unread indicator dot */}
                    {!item.read && (
                      <span className="h-1.5 w-1.5 rounded-none bg-accent shrink-0 mt-2" />
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
