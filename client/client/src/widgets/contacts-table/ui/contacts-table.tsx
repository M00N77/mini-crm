"use client";

// TODO: Replace with shadcn DataTable + TanStack Table
// Imports: entities/contact, shared/ui (Table, Pagination)

export function ContactsTable() {
  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-[1fr_1fr_auto] gap-gutter px-gutter py-3 border-b border-outline-variant bg-surface-container-low">
        <span className="typo-caption text-on-surface-variant">Имя</span>
        <span className="typo-caption text-on-surface-variant">Email</span>
        <span className="typo-caption text-on-surface-variant">Действия</span>
      </div>

      {/* Empty state */}
      <div className="p-6 text-center text-on-surface-variant/50 typo-body-sm">
        Контакты не найдены
      </div>

      {/* Pagination footer */}
      <div className="flex items-center justify-between px-gutter py-2 border-t border-outline-variant">
        <span className="typo-caption text-on-surface-variant">0 контактов</span>
        <div className="flex gap-1">
          {/* TODO: Pagination buttons */}
        </div>
      </div>
    </div>
  );
}
