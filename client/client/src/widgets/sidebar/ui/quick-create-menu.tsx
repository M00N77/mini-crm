"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, UserPlus, CheckSquare, StickyNote, ChevronDown } from "lucide-react";
import { useModalStore } from "@/shared/store/modal-store";
import { cn } from "@/shared/lib";

interface QuickCreateMenuProps {
  className?: string;
  onActionSelect?: () => void;
}

export function QuickCreateMenu({
  className,
  onActionSelect,
}: QuickCreateMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { openModal } = useModalStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  const handleAction = (modalType: "createContact" | "createTask" | "createNote") => {
    setIsOpen(false);
    onActionSelect?.();
    openModal(modalType);
  };

  return (
    <div className={cn("relative w-full", className)} ref={menuRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full bg-primary text-on-primary rounded-lg py-2 px-3 typo-body-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-between gap-2 cursor-pointer shadow-xs"
      >
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4 shrink-0" />
          <span>Новая запись</span>
        </div>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full mt-1.5 rounded-xl border border-outline-variant bg-surface-container-lowest p-1 shadow-xl shadow-black/20 z-50 overflow-hidden select-none space-y-0.5"
          >
            {/* Новый контакт */}
            <button
              type="button"
              onClick={() => handleAction("createContact")}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-on-surface hover:text-primary hover:bg-surface-container rounded-lg transition-colors cursor-pointer text-left group"
            >
              <div className="h-6 w-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors shrink-0">
                <UserPlus className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="font-semibold text-primary leading-tight">Контакт</p>
                <p className="text-[10px] text-on-surface-variant/70 mt-0.5">Добавить клиента</p>
              </div>
            </button>

            {/* Новая задача */}
            <button
              type="button"
              onClick={() => handleAction("createTask")}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-on-surface hover:text-primary hover:bg-surface-container rounded-lg transition-colors cursor-pointer text-left group"
            >
              <div className="h-6 w-6 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0">
                <CheckSquare className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="font-semibold text-primary leading-tight">Задача</p>
                <p className="text-[10px] text-on-surface-variant/70 mt-0.5">Добавить в Канбан</p>
              </div>
            </button>

            {/* Новая заметка */}
            <button
              type="button"
              onClick={() => handleAction("createNote")}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-on-surface hover:text-primary hover:bg-surface-container rounded-lg transition-colors cursor-pointer text-left group"
            >
              <div className="h-6 w-6 rounded-md bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors shrink-0">
                <StickyNote className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="font-semibold text-primary leading-tight">Заметка</p>
                <p className="text-[10px] text-on-surface-variant/70 mt-0.5">Зафиксировать детали</p>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
