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
        "group relative flex flex-col justify-between gap-3 rounded-none border border-border-subtle bg-surface p-3.5 shadow-2xs hover:border-border-strong transition-all duration-150",
        className
      )}
    >
      {/* Top Header: Protocol Tag + Contact badge & Actions */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-[10px] text-accent font-bold px-1.5 py-0.2 rounded-none bg-accent-subtle border border-accent-border">
              MEMO-{String(note.id).padStart(3, "0")}
            </span>
            <div className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-none bg-subtle text-xs text-text-primary max-w-full truncate border border-border-subtle font-mono">
              <User className="h-2.5 w-2.5 text-text-tertiary shrink-0" />
              <span className="truncate">
                {contactName || `ID#${contactId || "—"}`}
              </span>
            </div>
          </div>

          {contactCompany && (
            <span className="flex items-center gap-1 text-[10px] text-text-tertiary pl-0.5 font-mono truncate">
              <Building2 className="h-2.5 w-2.5 shrink-0" />
              <span className="truncate">{contactCompany}</span>
            </span>
          )}
        </div>

        {/* Edit & Delete Action Buttons */}
        <div className="flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity font-mono">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(note)}
              aria-label="Редактировать заметку"
              title="Редактировать"
              className="p-1 text-text-secondary hover:text-text-primary rounded-none hover:bg-muted transition-colors cursor-pointer"
            >
              <Edit2 className="h-3 w-3" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(note.id)}
              aria-label="Удалить заметку"
              title="Удалить"
              className="p-1 text-text-secondary hover:text-status-danger rounded-none hover:bg-status-danger/10 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Content body */}
      <p className="text-xs text-text-primary leading-relaxed whitespace-pre-wrap break-words line-clamp-6 flex-1 py-1">
        {note.content}
      </p>

      {/* Footer: Date */}
      {formattedDate && (
        <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[10px] text-text-tertiary font-mono">
          <span className="flex items-center gap-1 tabular-nums">
            <Calendar className="h-3 w-3" />
            {formattedDate}
          </span>
        </div>
      )}
    </div>
  );
}
