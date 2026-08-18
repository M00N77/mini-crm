"use client";

import { useState, useMemo } from "react";
import {
  useNotes,
  useDeleteNote,
  Note,
  NoteCard,
} from "@/entities/note";
import { useContacts } from "@/entities/contact";
import { Spinner, Button } from "@/shared/ui";
import { useModalStore } from "@/shared/store/modal-store";
import { CreateNoteButton } from "@/features/note-actions";
import { Search, X, Filter, StickyNote, AlertCircle } from "lucide-react";

export function NotesGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContactId, setSelectedContactId] = useState<number | "all">("all");

  const { openModal } = useModalStore();

  const {
    data: notesResponse,
    isLoading: isNotesLoading,
    isError: isNotesError,
    error: notesError,
  } = useNotes({ limit: 100 });

  const { data: contactsResponse, isLoading: isContactsLoading } = useContacts({
    limit: 100,
  });

  const { mutate: deleteNote } = useDeleteNote();

  const rawNotes: Note[] = useMemo(() => {
    if (Array.isArray(notesResponse)) return notesResponse;
    return notesResponse?.data || [];
  }, [notesResponse]);

  const rawContacts = useMemo(() => {
    if (Array.isArray(contactsResponse)) return contactsResponse;
    return contactsResponse?.data || [];
  }, [contactsResponse]);

  // Быстрый словарь контактов для O(1) поиска по contactId
  const contactsMap = useMemo(() => {
    const map = new Map<number, (typeof rawContacts)[0]>();
    rawContacts.forEach((contact) => {
      map.set(contact.id, contact);
    });
    return map;
  }, [rawContacts]);

  // Фильтрация заметок по поиску и выбранному контакту
  const filteredNotes = useMemo(() => {
    return rawNotes.filter((note) => {
      const contactId = note.contactId ?? note.contact_id;
      const contact = contactId ? contactsMap.get(contactId) : undefined;

      // Фильтр по контакту
      if (selectedContactId !== "all" && contactId !== selectedContactId) {
        return false;
      }

      // Фильтр по поисковой строке
      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase().trim();
      const contentMatch = note.content?.toLowerCase().includes(query);
      const contactNameMatch = contact?.name?.toLowerCase().includes(query);
      const companyMatch = contact?.company?.toLowerCase().includes(query);

      return contentMatch || contactNameMatch || companyMatch;
    });
  }, [rawNotes, contactsMap, selectedContactId, searchQuery]);

  const handleEditNote = (note: Note) => {
    openModal("editNote", {
      id: note.id,
      noteId: note.id,
      initialValues: note,
    });
  };

  const handleDeleteNote = (id: number) => {
    openModal("confirmDelete", {
      title: "Удалить заметку?",
      description: "Вы уверены, что хотите удалить эту заметку? Это действие необратимо.",
      confirmText: "Да, удалить",
      cancelText: "Отмена",
      variant: "destructive",
      onConfirm: async () => {
        deleteNote(id);
      },
    });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedContactId("all");
  };

  const isLoading = isNotesLoading || isContactsLoading;

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" label="Загрузка заметок..." />
      </div>
    );
  }

  if (isNotesError) {
    return (
      <div className="p-8 rounded-lg border border-error/30 bg-error-container/20 flex flex-col items-center justify-center text-center gap-2">
        <AlertCircle className="h-6 w-6 text-error" />
        <p className="typo-body-sm text-error font-medium">
          Ошибка при загрузке заметок
        </p>
        <p className="typo-caption text-on-surface-variant/70">
          {notesError instanceof Error
            ? notesError.message
            : "Не удалось получить список заметок"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
          {/* Поиск */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по заметкам, именам или компаниям..."
              className="w-full pl-9 pr-8 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest typo-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Очистить поиск"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-on-surface-variant/60 hover:text-on-surface rounded-full transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Фильтр по контакту */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={selectedContactId}
                onChange={(e) =>
                  setSelectedContactId(
                    e.target.value === "all" ? "all" : Number(e.target.value)
                  )
                }
                className="py-2 pl-3 pr-8 rounded-lg border border-outline-variant bg-surface-container-lowest typo-body-sm text-on-surface focus:border-primary focus:outline-none transition-colors cursor-pointer appearance-none text-xs"
              >
                <option value="all">Все контакты ({rawNotes.length})</option>
                {rawContacts.map((c) => {
                  const count = rawNotes.filter(
                    (n) => (n.contactId ?? n.contact_id) === c.id
                  ).length;
                  if (count === 0) return null;
                  return (
                    <option key={c.id} value={c.id}>
                      {c.name} ({count})
                    </option>
                  );
                })}
              </select>
              <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-on-surface-variant/60 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Общий счетчик */}
        <div className="typo-caption text-on-surface-variant text-right hidden sm:block">
          Найдено заметок:{" "}
          <span className="font-semibold text-primary">
            {filteredNotes.length}
          </span>
        </div>
      </div>

      {/* Пустое состояние (нет заметок вообще) */}
      {rawNotes.length === 0 && (
        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="h-12 w-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant/60">
            <StickyNote className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="typo-body-lg font-medium text-primary">
              Заметок пока нет
            </h3>
            <p className="typo-caption text-on-surface-variant/70 max-w-sm">
              Фиксируйте важные детали переговоров, договоренности и планы по каждому контакту.
            </p>
          </div>
          <CreateNoteButton variant="default" className="mt-2">
            Добавить первую заметку
          </CreateNoteButton>
        </div>
      )}

      {/* Поиск ничего не нашел */}
      {rawNotes.length > 0 && filteredNotes.length === 0 && (
        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-10 text-center flex flex-col items-center justify-center gap-2">
          <Search className="h-6 w-6 text-on-surface-variant/40" />
          <p className="typo-body-sm text-on-surface-variant font-medium">
            Ничего не найдено
          </p>
          <p className="typo-caption text-on-surface-variant/60">
            По заданным фильтрам заметок не обнаружено
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={handleClearFilters}
            className="mt-2 text-xs py-1 px-3 border-outline-variant text-primary"
          >
            Сбросить фильтры
          </Button>
        </div>
      )}

      {/* Сетка заметок */}
      {filteredNotes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => {
            const contactId = note.contactId ?? note.contact_id;
            const contact = contactId ? contactsMap.get(contactId) : undefined;

            return (
              <NoteCard
                key={note.id}
                note={note}
                contactName={contact?.name}
                contactCompany={contact?.company}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
