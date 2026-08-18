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
        className="w-full bg-accent text-accent-contrast rounded-none py-2 px-3 text-xs font-semibold hover:bg-accent-hover active:scale-[0.99] transition-all flex items-center justify-between gap-2 cursor-pointer shadow-xs border border-accent-border"
      >
        <div className="flex items-center gap-2 font-mono">
          <Plus className="h-4 w-4 shrink-0" />
          <span>НОВАЯ ЗАПИСЬ</span>
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
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full mt-1.5 rounded-none border border-border-strong bg-surface p-1 shadow-xl shadow-black/20 z-50 overflow-hidden select-none space-y-0.5"
          >
            {/* Новый контакт */}
            <button
              type="button"
              onClick={() => handleAction("createContact")}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-subtle rounded-none transition-colors cursor-pointer text-left group font-sans"
            >
              <div className="h-6 w-6 rounded-none bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors shrink-0">
                <UserPlus className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="font-semibold text-text-primary leading-tight">Контакт</p>
                <p className="text-[10px] text-text-tertiary mt-0.5 font-mono">Добавить клиента</p>
              </div>
            </button>

            {/* Новая задача */}
            <button
              type="button"
              onClick={() => handleAction("createTask")}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-subtle rounded-none transition-colors cursor-pointer text-left group font-sans"
            >
              <div className="h-6 w-6 rounded-none bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0">
                <CheckSquare className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="font-semibold text-text-primary leading-tight">Задача</p>
                <p className="text-[10px] text-text-tertiary mt-0.5 font-mono">Добавить в Канбан</p>
              </div>
            </button>

            {/* Новая заметка */}
            <button
              type="button"
              onClick={() => handleAction("createNote")}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-subtle rounded-none transition-colors cursor-pointer text-left group font-sans"
            >
              <div className="h-6 w-6 rounded-none bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors shrink-0">
                <StickyNote className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="font-semibold text-text-primary leading-tight">Заметка</p>
                <p className="text-[10px] text-text-tertiary mt-0.5 font-mono">Зафиксировать детали</p>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
