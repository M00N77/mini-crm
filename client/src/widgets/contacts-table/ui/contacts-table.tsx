"use client";

import { useState, useMemo } from "react";
import { useContacts, useDeleteContact, ContactRow } from "@/entities/contact";
import { Spinner, Button } from "@/shared/ui";
import { useModalStore } from "@/shared/store/modal-store";
import { sortByField, SortOrder } from "@/shared/lib";
import {
  AlertCircle,
  UserX,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

type SortField = "createdAt" | "name" | "company" | "email";

export function ContactsTable() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const { openModal } = useModalStore();
  const { data: response, isLoading, isError, error } = useContacts({
    page,
    limit,
  });
  const deleteContactMutation = useDeleteContact();

  const rawList = useMemo(() => response?.data || [], [response?.data]);
  const total = response?.pagination?.total ?? rawList.length;
  const totalPages = Math.max(
    1,
    response?.pagination?.totalPages ?? Math.ceil(total / limit)
  );

  // Фильтрация по поиску и кастомная сортировка MergeSort O(n log n)
  const filteredAndSortedList = useMemo(() => {
    let list = rawList;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter((c) => {
        const nameMatch = c.name?.toLowerCase().includes(query);
        const emailMatch = c.email?.toLowerCase().includes(query);
        const phoneMatch = c.phone?.toLowerCase().includes(query);
        const companyMatch = c.company?.toLowerCase().includes(query);
        const positionMatch = (c.position || c.jobPosition)
          ?.toLowerCase()
          .includes(query);
        return (
          nameMatch || emailMatch || phoneMatch || companyMatch || positionMatch
        );
      });
    }

    return sortByField(list, sortBy, sortOrder);
  }, [rawList, searchQuery, sortBy, sortOrder]);

  const handleToggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleDelete = (id: number) => {
    const contact = rawList.find((c) => c.id === id);
    const contactName = contact?.name ? `«${contact.name}»` : "этот контакт";

    openModal("confirmDelete", {
      title: "Удалить контакт?",
      description: `Вы действительно хотите удалить контакт ${contactName}? Это действие необратимо.`,
      confirmText: "Да, удалить",
      cancelText: "Отмена",
      variant: "destructive",
      onConfirm: async () => {
        await deleteContactMutation.mutateAsync(id);
      },
    });
  };

  const handleEdit = (contact: Parameters<typeof ContactRow>[0]["contact"]) => {
    openModal("editContact", {
      id: contact.id,
      initialValues: contact,
    });
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Расчет диапазона отображаемых элементов
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="space-y-3">
      {/* Поисковая строка и панель сортировки */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
          {/* Поиск */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по имени, email, телефону, компании..."
              className="w-full pl-9 pr-8 py-1.5 rounded-none border border-border-subtle bg-surface text-xs font-mono text-text-primary placeholder:text-text-tertiary focus:border-border-strong focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Очистить поиск"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-text-tertiary hover:text-text-primary rounded-none transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Селектор сортировки */}
          <div className="relative">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-") as [
                  SortField,
                  SortOrder
                ];
                setSortBy(field);
                setSortOrder(order);
              }}
              className="py-1.5 pl-3 pr-8 rounded-none border border-border-subtle bg-surface text-xs font-mono text-text-primary focus:border-border-strong focus:outline-none transition-colors cursor-pointer appearance-none"
            >
              <option value="createdAt-desc">Сначала новые (по дате)</option>
              <option value="createdAt-asc">Сначала старые (по дате)</option>
              <option value="name-asc">По имени (А → Я)</option>
              <option value="name-desc">По имени (Я → А)</option>
              <option value="company-asc">По компании (А → Я)</option>
              <option value="email-asc">По Email (A → Z)</option>
            </select>
            <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-tertiary pointer-events-none" />
          </div>
        </div>

        <div className="text-xs font-mono text-text-tertiary text-right hidden sm:block">
          ВСЕГО В БАЗЕ: <span className="font-bold text-accent tabular-nums">{total}</span>
        </div>
      </div>

      {/* Таблица */}
      <div className="rounded-none border border-border-subtle bg-surface overflow-hidden shadow-2xs">
        {/* Table header с кликабельной сортировкой */}
        <div className="grid grid-cols-[1.5fr_1.5fr_1fr_auto] gap-gutter px-gutter py-2.5 border-b border-border-subtle bg-subtle select-none font-mono text-xs text-text-secondary">
          {/* Имя */}
          <button
            type="button"
            onClick={() => handleToggleSort("name")}
            className="flex items-center gap-1.5 font-bold hover:text-text-primary transition-colors cursor-pointer text-left group"
          >
            <span>ИМЯ</span>
            {sortBy === "name" ? (
              sortOrder === "asc" ? (
                <ArrowUp className="h-3.5 w-3.5 text-accent" />
              ) : (
                <ArrowDown className="h-3.5 w-3.5 text-accent" />
              )
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-30 group-hover:opacity-70 transition-opacity" />
            )}
          </button>

          {/* Email */}
          <button
            type="button"
            onClick={() => handleToggleSort("email")}
            className="flex items-center gap-1.5 font-bold hover:text-text-primary transition-colors cursor-pointer text-left group"
          >
            <span>EMAIL</span>
            {sortBy === "email" ? (
              sortOrder === "asc" ? (
                <ArrowUp className="h-3.5 w-3.5 text-accent" />
              ) : (
                <ArrowDown className="h-3.5 w-3.5 text-accent" />
              )
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-30 group-hover:opacity-70 transition-opacity" />
            )}
          </button>

          {/* Телефон */}
          <span className="font-bold hidden sm:block">
            ТЕЛЕФОН
          </span>

          {/* Действия */}
          <span className="font-bold text-right pr-1">
            ДЕЙСТВИЯ
          </span>
        </div>

        {/* Состояние загрузки */}
        {isLoading && (
          <div className="py-12 flex items-center justify-center">
            <Spinner size="md" label="Загрузка контактов..." />
          </div>
        )}

        {/* Состояние ошибки */}
        {isError && (
          <div className="p-8 flex flex-col items-center justify-center text-center gap-2">
            <AlertCircle className="h-6 w-6 text-status-danger" />
            <p className="text-sm font-semibold text-status-danger">
              Ошибка при загрузке контактов
            </p>
            <p className="text-xs font-mono text-text-tertiary">
              {error instanceof Error
                ? error.message
                : "Не удалось получить список контактов"}
            </p>
          </div>
        )}

        {/* Пустое состояние (нет контактов вообще) */}
        {!isLoading && !isError && rawList.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-2 font-mono">
            <div className="h-10 w-10 rounded-none bg-subtle border border-border-subtle flex items-center justify-center text-text-tertiary">
              <UserX className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-text-primary">
              // КОНТАКТЫ НЕ НАЙДЕНЫ
            </p>
            <p className="text-xs text-text-tertiary">
              Добавьте первый контакт, чтобы начать работу
            </p>
          </div>
        )}

        {/* Результат поиска пуст */}
        {!isLoading &&
          !isError &&
          rawList.length > 0 &&
          filteredAndSortedList.length === 0 && (
            <div className="py-10 flex flex-col items-center justify-center text-center gap-2 font-mono">
              <Search className="h-6 w-6 text-text-tertiary" />
              <p className="text-xs font-bold text-text-primary">
                // НИЧЕГО НЕ НАЙДЕНО
              </p>
              <p className="text-xs text-text-tertiary">
                По запросу «{searchQuery}» совпадений нет
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={handleClearSearch}
                className="mt-2 text-xs py-1 px-3"
              >
                Сбросить поиск
              </Button>
            </div>
          )}

        {/* Список контактов */}
        {!isLoading && !isError && filteredAndSortedList.length > 0 && (
          <div className="divide-y divide-border-subtle">
            {filteredAndSortedList.map((contact) => (
              <ContactRow
                key={contact.id}
                contact={contact}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Панель пагинации внизу таблицы */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-gutter py-2.5 border-t border-border-subtle bg-subtle font-mono text-xs">
          <span className="text-text-tertiary">
            {isLoading
              ? "Загрузка..."
              : total > 0
              ? `Показано ${startItem}–${endItem} из ${total}`
              : "Контактов: 0"}
          </span>

          {/* Кнопки переключения страниц */}
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-7 px-2 text-xs gap-1 disabled:opacity-40 cursor-pointer rounded-none"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Назад</span>
            </Button>

            {/* Номера страниц */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    (p >= page - 1 && p <= page + 1)
                )
                .map((p, idx, arr) => {
                  const prevPage = arr[idx - 1];
                  const hasGap = prevPage && p - prevPage > 1;

                  return (
                    <div key={p} className="flex items-center gap-1">
                      {hasGap && (
                        <span className="px-1 text-xs text-text-tertiary select-none">
                          ...
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setPage(p)}
                        className={`h-7 min-w-7 px-1.5 rounded-none text-xs font-mono font-medium transition-colors cursor-pointer ${
                          page === p
                            ? "bg-accent text-accent-contrast font-bold"
                            : "text-text-secondary hover:text-text-primary hover:bg-muted border border-border-subtle"
                        }`}
                      >
                        {p}
                      </button>
                    </div>
                  );
                })}
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-7 px-2 text-xs gap-1 disabled:opacity-40 cursor-pointer rounded-none"
            >
              <span className="hidden sm:inline">Вперед</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
