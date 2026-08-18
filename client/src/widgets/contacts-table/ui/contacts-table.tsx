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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по имени, email, телефону, компании..."
              className="w-full pl-9 pr-8 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest typo-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Очистить поиск"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-on-surface-variant/60 hover:text-on-surface rounded-full transition-colors"
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
              className="py-2 pl-3 pr-8 rounded-lg border border-outline-variant bg-surface-container-lowest typo-body-sm text-on-surface focus:border-primary focus:outline-none transition-colors cursor-pointer appearance-none text-xs font-medium"
            >
              <option value="createdAt-desc">Сначала новые (по дате)</option>
              <option value="createdAt-asc">Сначала старые (по дате)</option>
              <option value="name-asc">По имени (А → Я)</option>
              <option value="name-desc">По имени (Я → А)</option>
              <option value="company-asc">По компании (А → Я)</option>
              <option value="email-asc">По Email (A → Z)</option>
            </select>
            <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-on-surface-variant/60 pointer-events-none" />
          </div>
        </div>

        <div className="typo-caption text-on-surface-variant text-right hidden sm:block">
          Всего в базе: <span className="font-semibold text-primary">{total}</span>
        </div>
      </div>

      {/* Таблица */}
      <div className="rounded-lg border border-outline-variant bg-surface-container-lowest overflow-hidden shadow-xs">
        {/* Table header с кликабельной сортировкой */}
        <div className="grid grid-cols-[1.5fr_1.5fr_1fr_auto] gap-gutter px-gutter py-3 border-b border-outline-variant bg-surface-container-low select-none">
          {/* Имя */}
          <button
            type="button"
            onClick={() => handleToggleSort("name")}
            className="flex items-center gap-1.5 typo-caption text-on-surface-variant hover:text-primary font-medium transition-colors cursor-pointer text-left group"
          >
            <span>Имя</span>
            {sortBy === "name" ? (
              sortOrder === "asc" ? (
                <ArrowUp className="h-3.5 w-3.5 text-primary" />
              ) : (
                <ArrowDown className="h-3.5 w-3.5 text-primary" />
              )
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-30 group-hover:opacity-70 transition-opacity" />
            )}
          </button>

          {/* Email */}
          <button
            type="button"
            onClick={() => handleToggleSort("email")}
            className="flex items-center gap-1.5 typo-caption text-on-surface-variant hover:text-primary font-medium transition-colors cursor-pointer text-left group"
          >
            <span>Email</span>
            {sortBy === "email" ? (
              sortOrder === "asc" ? (
                <ArrowUp className="h-3.5 w-3.5 text-primary" />
              ) : (
                <ArrowDown className="h-3.5 w-3.5 text-primary" />
              )
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-30 group-hover:opacity-70 transition-opacity" />
            )}
          </button>

          {/* Телефон */}
          <span className="typo-caption text-on-surface-variant font-medium hidden sm:block">
            Телефон
          </span>

          {/* Действия */}
          <span className="typo-caption text-on-surface-variant font-medium text-right pr-1">
            Действия
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
            <AlertCircle className="h-6 w-6 text-error" />
            <p className="typo-body-sm text-error font-medium">
              Ошибка при загрузке контактов
            </p>
            <p className="typo-caption text-on-surface-variant/70">
              {error instanceof Error
                ? error.message
                : "Не удалось получить список контактов"}
            </p>
          </div>
        )}

        {/* Пустое состояние (нет контактов вообще) */}
        {!isLoading && !isError && rawList.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-2">
            <div className="h-10 w-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant/60">
              <UserX className="h-5 w-5" />
            </div>
            <p className="typo-body-sm text-on-surface-variant font-medium">
              Контакты не найдены
            </p>
            <p className="typo-caption text-on-surface-variant/60">
              Добавьте первый контакт, чтобы начать работу
            </p>
          </div>
        )}

        {/* Результат поиска пуст */}
        {!isLoading &&
          !isError &&
          rawList.length > 0 &&
          filteredAndSortedList.length === 0 && (
            <div className="py-10 flex flex-col items-center justify-center text-center gap-2">
              <Search className="h-6 w-6 text-on-surface-variant/40" />
              <p className="typo-body-sm text-on-surface-variant font-medium">
                Ничего не найдено
              </p>
              <p className="typo-caption text-on-surface-variant/60">
                По запросу «{searchQuery}» совпадений нет
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={handleClearSearch}
                className="mt-2 text-xs py-1 px-3 border-outline-variant text-primary"
              >
                Сбросить поиск
              </Button>
            </div>
          )}

        {/* Список контактов */}
        {!isLoading && !isError && filteredAndSortedList.length > 0 && (
          <div className="divide-y divide-outline-variant/60">
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-gutter py-3 border-t border-outline-variant bg-surface-container-low/40">
          <span className="typo-caption text-on-surface-variant">
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
              className="h-8 px-2.5 text-xs gap-1 border-outline-variant text-on-surface hover:bg-surface-container disabled:opacity-40 cursor-pointer"
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
                        <span className="px-1 text-xs text-on-surface-variant/50 select-none">
                          ...
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setPage(p)}
                        className={`h-8 min-w-8 px-2 rounded text-xs font-medium transition-colors cursor-pointer ${
                          page === p
                            ? "bg-primary text-on-primary"
                            : "text-on-surface hover:bg-surface-container border border-outline-variant/60"
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
              className="h-8 px-2.5 text-xs gap-1 border-outline-variant text-on-surface hover:bg-surface-container disabled:opacity-40 cursor-pointer"
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
