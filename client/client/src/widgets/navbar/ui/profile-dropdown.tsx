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
        className="flex items-center gap-2 p-1 rounded-full hover:bg-surface-container transition-colors cursor-pointer group"
      >
        <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold text-xs flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
          {initial}
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-on-surface-variant group-hover:text-primary transition-colors hidden sm:block" />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-64 rounded-xl border border-outline-variant bg-surface-container-lowest p-1.5 shadow-xl shadow-black/20 z-50 overflow-hidden select-none"
          >
            {/* User Info Header */}
            <div className="px-3 py-2.5 border-b border-outline-variant/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-primary text-on-primary font-bold text-sm flex items-center justify-center shrink-0">
                  {initial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="typo-body-sm font-semibold text-primary truncate leading-tight">
                    {user?.name || "Пользователь"}
                  </p>
                  <p className="typo-caption text-on-surface-variant/70 text-[11px] truncate mt-0.5">
                    {user?.email || "user@nexus.crm"}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Actions */}
            <div className="py-1 space-y-0.5">
              <button
                type="button"
                onClick={handleOpenSettings}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-on-surface hover:text-primary hover:bg-surface-container rounded-lg transition-colors cursor-pointer text-left"
              >
                <Settings className="h-4 w-4 text-on-surface-variant shrink-0" />
                <span>Настройки аккаунта</span>
              </button>

              <button
                type="button"
                onClick={handleOpenSettings}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-on-surface hover:text-primary hover:bg-surface-container rounded-lg transition-colors cursor-pointer text-left"
              >
                <UserIcon className="h-4 w-4 text-on-surface-variant shrink-0" />
                <span>Профиль</span>
              </button>
            </div>

            {/* Logout button */}
            <div className="pt-1 border-t border-outline-variant/60">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-error hover:bg-error-container/20 rounded-lg transition-colors cursor-pointer text-left"
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
