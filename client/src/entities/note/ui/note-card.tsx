"use client";

import { Note } from "../model/types";
import { User, Calendar, Edit2, Trash2, Building2 } from "lucide-react";
import { cn } from "@/shared/lib";

interface NoteCardProps {
  note: Note;
  contactName?: string;
  contactCompany?: string | null;
  onEdit?: (note: Note) => void;
  onDelete?: (id: number) => void;
  className?: string;
}

export function NoteCard({
  note,
  contactName,
  contactCompany,
  onEdit,
  onDelete,
  className,
}: NoteCardProps) {
  const contactId = note.contactId ?? note.contact_id;
  const rawDate = note.createdAt || note.created_at;
  const formattedDate = rawDate
    ? new Date(rawDate).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between gap-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest p-4 shadow-xs hover:border-outline transition-all duration-150",
        className
      )}
    >
      {/* Top Header: Contact badge & Actions */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface-container text-xs font-medium text-primary max-w-full truncate border border-outline-variant/60">
            <User className="h-3 w-3 text-primary/70 shrink-0" />
            <span className="truncate">
              {contactName || `Контакт #${contactId || "—"}`}
            </span>
          </div>

          {contactCompany && (
            <span className="flex items-center gap-1 text-[11px] text-on-surface-variant/70 pl-0.5 mt-0.5 truncate">
              <Building2 className="h-3 w-3 shrink-0" />
              <span className="truncate">{contactCompany}</span>
            </span>
          )}
        </div>

        {/* Edit & Delete Action Buttons */}
        <div className="flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(note)}
              aria-label="Редактировать заметку"
              title="Редактировать"
              className="p-1.5 text-on-surface-variant hover:text-primary rounded hover:bg-surface-container transition-colors cursor-pointer"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(note.id)}
              aria-label="Удалить заметку"
              title="Удалить"
              className="p-1.5 text-on-surface-variant hover:text-error rounded hover:bg-surface-container transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content body */}
      <p className="typo-body-sm text-on-surface leading-relaxed whitespace-pre-wrap break-words line-clamp-6 flex-1">
        {note.content}
      </p>

      {/* Footer: Date */}
      {formattedDate && (
        <div className="pt-2 border-t border-outline-variant/50 flex items-center justify-between text-[11px] text-on-surface-variant/60">
          <span className="flex items-center gap-1 font-label-mono">
            <Calendar className="h-3 w-3" />
            {formattedDate}
          </span>
        </div>
      )}
    </div>
  );
}
