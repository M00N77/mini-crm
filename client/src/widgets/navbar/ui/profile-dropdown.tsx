"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User as UserIcon, Settings, LogOut, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/shared/store/use-auth-store";
import { useModalStore } from "@/shared/store/modal-store";
import { apiClient } from "@/shared/api";

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { openModal } = useModalStore();

  // Закрытие при клике вне меню
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
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

  const handleLogout = async () => {
    setIsOpen(false);
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // ignore
    } finally {
      logout();
      router.replace("/");
    }
  };

  const handleOpenSettings = () => {
    setIsOpen(false);
    openModal("accountSettings");
  };

  const initial = (user?.name || user?.email || "U").charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Профиль пользователя"
        className="flex items-center gap-2 p-1 rounded-none hover:bg-subtle transition-colors cursor-pointer group"
      >
        <div className="w-8 h-8 rounded-none bg-accent text-accent-contrast font-mono font-bold text-xs flex items-center justify-center border border-accent-border shadow-xs transition-transform group-hover:scale-105">
          {initial}
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-text-secondary group-hover:text-text-primary transition-colors hidden sm:block" />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-64 rounded-none border border-border-strong bg-surface p-1.5 shadow-xl shadow-black/20 z-50 overflow-hidden select-none"
          >
            {/* User Info Header */}
            <div className="px-3 py-2.5 border-b border-border-subtle">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-none bg-accent text-accent-contrast font-mono font-bold text-sm flex items-center justify-center shrink-0 border border-accent-border">
                  {initial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-text-primary truncate leading-tight">
                    {user?.name || "Пользователь"}
                  </p>
                  <p className="text-[11px] font-mono text-text-tertiary truncate mt-0.5">
                    {user?.email || "user@nexus.crm"}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Actions */}
            <div className="py-1 space-y-0.5 font-sans">
              <button
                type="button"
                onClick={handleOpenSettings}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-subtle rounded-none transition-colors cursor-pointer text-left"
              >
                <Settings className="h-4 w-4 text-text-tertiary shrink-0" />
                <span>Настройки аккаунта</span>
              </button>

              <button
                type="button"
                onClick={handleOpenSettings}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-subtle rounded-none transition-colors cursor-pointer text-left"
              >
                <UserIcon className="h-4 w-4 text-text-tertiary shrink-0" />
                <span>Профиль</span>
              </button>
            </div>

            {/* Logout button */}
            <div className="pt-1 border-t border-border-subtle font-sans">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-status-danger hover:bg-status-danger/10 rounded-none transition-colors cursor-pointer text-left"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Выйти из системы</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
