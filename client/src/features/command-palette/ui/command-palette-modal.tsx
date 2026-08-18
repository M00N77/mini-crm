"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
} from "@/shared/ui";
import { useModalStore } from "@/shared/store/modal-store";
import { useContacts } from "@/entities/contact";
import { useTasks } from "@/entities/task";
import { useNotes } from "@/entities/note";
import {
  Search,
  LayoutDashboard,
  Users,
  CheckSquare,
  StickyNote,
  UserPlus,
  Settings,
  Plus,
  ArrowRight,
  Sparkles,
  Command,
} from "lucide-react";
import { cn } from "@/shared/lib";

interface CommandItem {
  id: string;
  category: "Навигация" | "Быстрые действия" | "Контакты" | "Задачи" | "Заметки";
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  perform: () => void;
}

interface CommandPaletteContentProps {
  onClose: () => void;
}

function CommandPaletteContent({ onClose }: CommandPaletteContentProps) {
  const router = useRouter();
  const { openModal } = useModalStore();

  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Загружаем данные для живого поиска
  const { data: contactsData } = useContacts({ limit: 50 });
  const { data: tasksData } = useTasks({ limit: 50 });
  const { data: notesData } = useNotes({ limit: 50 });

  const contacts = useMemo(() => contactsData?.data || [], [contactsData]);
  const tasks = useMemo(() => tasksData?.data || [], [tasksData]);
  const notes = useMemo(() => notesData?.data || [], [notesData]);

  // Все доступные команды и элементы
  const allCommands = useMemo<CommandItem[]>(() => {
    const query = search.toLowerCase().trim();

    const staticItems: CommandItem[] = [
      // Навигация
      {
        id: "nav-overview",
        category: "Навигация",
        title: "Главный обзор (Overview)",
        subtitle: "Сводка, метрики и активность",
        icon: <LayoutDashboard className="h-4 w-4 text-primary" />,
        perform: () => {
          onClose();
          router.push("/dashboard");
        },
      },
      {
        id: "nav-contacts",
        category: "Навигация",
        title: "Контакты (Contacts)",
        subtitle: "Таблица контактов и клиентов",
        icon: <Users className="h-4 w-4 text-blue-500" />,
        perform: () => {
          onClose();
          router.push("/dashboard/contacts");
        },
      },
      {
        id: "nav-tasks",
        category: "Навигация",
        title: "Канбан-доска задач (Tasks)",
        subtitle: "Управление статусами задач",
        icon: <CheckSquare className="h-4 w-4 text-emerald-500" />,
        perform: () => {
          onClose();
          router.push("/dashboard/tasks");
        },
      },
      {
        id: "nav-notes",
        category: "Навигация",
        title: "Заметки (Notes)",
        subtitle: "Все записи и прикрепления",
        icon: <StickyNote className="h-4 w-4 text-purple-500" />,
        perform: () => {
          onClose();
          router.push("/dashboard/notes");
        },
      },

      // Быстрые действия
      {
        id: "act-create-contact",
        category: "Быстрые действия",
        title: "Создать контакт",
        subtitle: "Добавить нового клиента в базу",
        icon: <UserPlus className="h-4 w-4 text-blue-500" />,
        perform: () => {
          onClose();
          openModal("createContact");
        },
      },
      {
        id: "act-create-task",
        category: "Быстрые действия",
        title: "Создать задачу",
        subtitle: "Добавить карточку на Канбан-доску",
        icon: <Plus className="h-4 w-4 text-emerald-500" />,
        perform: () => {
          onClose();
          openModal("createTask");
        },
      },
      {
        id: "act-create-note",
        category: "Быстрые действия",
        title: "Добавить заметку",
        subtitle: "Зафиксировать важную информацию",
        icon: <StickyNote className="h-4 w-4 text-purple-500" />,
        perform: () => {
          onClose();
          openModal("createNote");
        },
      },
      {
        id: "act-account-settings",
        category: "Быстрые действия",
        title: "Настройки аккаунта",
        subtitle: "Смена пароля и параметры безопасности",
        icon: <Settings className="h-4 w-4 text-on-surface-variant" />,
        perform: () => {
          onClose();
          openModal("accountSettings");
        },
      },
    ];

    // Динамические результаты контактов
    const contactItems: CommandItem[] = contacts.map((c) => ({
      id: `contact-${c.id}`,
      category: "Контакты",
      title: c.name || "Без имени",
      subtitle: [c.company, c.position || c.jobPosition, c.email]
        .filter(Boolean)
        .join(" • "),
      icon: <Users className="h-4 w-4 text-blue-500" />,
      perform: () => {
        onClose();
        router.push("/dashboard/contacts");
      },
    }));

    // Динамические результаты задач
    const taskItems: CommandItem[] = tasks.map((t) => ({
      id: `task-${t.id}`,
      category: "Задачи",
      title: t.title,
      subtitle: `Статус: ${
        t.status === "in_progress"
          ? "In Progress"
          : t.status === "done"
          ? "Done"
          : "Pending"
      }`,
      icon: <CheckSquare className="h-4 w-4 text-emerald-500" />,
      perform: () => {
        onClose();
        router.push("/dashboard/tasks");
      },
    }));

    // Динамические результаты заметок
    const noteItems: CommandItem[] = notes.map((n) => {
      const contactName = n.contactId
        ? contacts.find((c) => c.id === n.contactId)?.name
        : undefined;

      return {
        id: `note-${n.id}`,
        category: "Заметки",
        title: n.content.slice(0, 45) || "Заметка",
        subtitle: contactName
          ? `Прикреплено к: ${contactName}`
          : n.content.length > 45
          ? `${n.content.slice(0, 60)}...`
          : undefined,
        icon: <StickyNote className="h-4 w-4 text-purple-500" />,
        perform: () => {
          onClose();
          router.push("/dashboard/notes");
        },
      };
    });

    const combined = [
      ...staticItems,
      ...contactItems,
      ...taskItems,
      ...noteItems,
    ];

    if (!query) {
      return staticItems;
    }

    return combined.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.subtitle?.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );
  }, [search, contacts, tasks, notes, router, onClose, openModal]);

  // Навигация стрелочками клавиатуры
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < allCommands.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : allCommands.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = allCommands[selectedIndex];
      if (selected) {
        selected.perform();
      }
    }
  };

  // Автоскролл к выбранному элементу
  useEffect(() => {
    const listElement = listRef.current;
    if (!listElement) return;

    const activeItem = listElement.querySelector(`[data-index="${selectedIndex}"]`);
    if (activeItem) {
      activeItem.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  // Группировка результатов по категориям
  const groupedCommands = useMemo(() => {
    const groups: { category: string; items: { item: CommandItem; index: number }[] }[] = [];
    const categoryMap = new Map<string, { item: CommandItem; index: number }[]>();

    allCommands.forEach((item, index) => {
      if (!categoryMap.has(item.category)) {
        categoryMap.set(item.category, []);
      }
      categoryMap.get(item.category)!.push({ item, index });
    });

    categoryMap.forEach((items, category) => {
      groups.push({ category, items });
    });

    return groups;
  }, [allCommands]);

  return (
    <>
      {/* Поле ввода */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-outline-variant/70 bg-surface-container-low/50">
        <Search className="h-5 w-5 text-primary shrink-0" />
        <input
          ref={inputRef}
          autoFocus
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Поиск по CRM, контактам, задачам или командам..."
          className="w-full bg-transparent typo-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none"
        />
        <kbd className="hidden sm:inline-flex items-center gap-1 typo-label-mono text-[10px] text-on-surface-variant/70 bg-surface-container border border-outline-variant rounded px-1.5 py-0.5">
          ESC
        </kbd>
      </div>

      {/* Список результатов */}
      <div
        ref={listRef}
        className="max-h-[380px] overflow-y-auto p-2 divide-y divide-transparent select-none"
      >
        {allCommands.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center p-6 text-on-surface-variant/60">
            <Sparkles className="h-8 w-8 text-on-surface-variant/30 mb-2" />
            <p className="typo-body-sm font-medium text-on-surface-variant">
              Ничего не найдено
            </p>
            <p className="typo-caption text-xs text-on-surface-variant/50 mt-0.5">
              Попробуйте изменить запрос «{search}»
            </p>
          </div>
        ) : (
          groupedCommands.map((group) => (
            <div key={group.category} className="py-1.5">
              <div className="px-3 py-1 typo-caption text-[11px] font-semibold text-on-surface-variant/70 uppercase tracking-wider">
                {group.category}
              </div>
              <div className="space-y-0.5 mt-0.5">
                {group.items.map(({ item, index }) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      data-index={index}
                      onClick={() => item.perform()}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={cn(
                        "flex items-center justify-between gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all",
                        isSelected
                          ? "bg-primary text-on-primary font-medium shadow-xs"
                          : "text-on-surface hover:bg-surface-container"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={cn(
                            "h-7 w-7 rounded-md flex items-center justify-center shrink-0 border transition-colors",
                            isSelected
                              ? "bg-black/10 border-black/20 text-on-primary"
                              : "bg-surface-container border-outline-variant/60"
                          )}
                        >
                          {item.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "typo-body-sm text-xs truncate leading-tight",
                              isSelected ? "text-on-primary font-semibold" : "text-on-surface"
                            )}
                          >
                            {item.title}
                          </p>
                          {item.subtitle && (
                            <p
                              className={cn(
                                "typo-caption text-[11px] truncate mt-0.5",
                                isSelected
                                  ? "text-on-primary/80"
                                  : "text-on-surface-variant/70"
                              )}
                            >
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex items-center gap-1 text-[11px] text-on-primary/80 shrink-0 font-label-mono">
                          <span>Перейти</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Футер с подсказками клавиш */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-outline-variant/60 bg-surface-container-low/30 typo-caption text-[11px] text-on-surface-variant/70">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <kbd className="font-label-mono bg-surface-container border border-outline-variant px-1 rounded text-[10px]">
              ↑
            </kbd>
            <kbd className="font-label-mono bg-surface-container border border-outline-variant px-1 rounded text-[10px]">
              ↓
            </kbd>
            <span>Навигация</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="font-label-mono bg-surface-container border border-outline-variant px-1 rounded text-[10px]">
              ↵
            </kbd>
            <span>Выбрать</span>
          </span>
        </div>

        <div className="flex items-center gap-1 text-primary font-medium">
          <Command className="h-3 w-3" />
          <span>Nexus Command</span>
        </div>
      </div>
    </>
  );
}

export function CommandPaletteModal() {
  const { isOpen, type, openModal, closeModal } = useModalStore();
  const isPaletteOpen = isOpen && type === "commandPalette";

  // Глобальный слушатель ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isPaletteOpen) {
          closeModal();
        } else {
          openModal("commandPalette");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPaletteOpen, openModal, closeModal]);

  return (
    <Dialog open={isPaletteOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[620px] p-0 bg-surface-container-lowest border-outline-variant text-on-surface overflow-hidden shadow-2xl shadow-black/40 gap-0">
        {isPaletteOpen && <CommandPaletteContent onClose={closeModal} />}
      </DialogContent>
    </Dialog>
  );
}
