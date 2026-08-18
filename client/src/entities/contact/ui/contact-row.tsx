"use client";

import type { Contact } from "../model/types";
import { MoreHorizontal, Trash2, Edit2 } from "lucide-react";
import { cn } from "@/shared/lib";

interface ContactRowProps {
  contact: Contact;
  className?: string;
  onEdit?: (contact: Contact) => void;
  onDelete?: (id: number) => void;
}

export function ContactRow({ contact, className, onEdit, onDelete }: ContactRowProps) {
  const initials = contact.name
    ? contact.name
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div
      className={cn(
        "grid grid-cols-[1.5fr_1.5fr_1fr_auto] gap-gutter px-gutter py-3 items-center border-b border-outline-variant/60 hover:bg-surface-container-low transition-colors last:border-b-0",
        className
      )}
    >
      {/* Contact name & avatar */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="h-8 w-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary font-medium text-xs shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="typo-body-sm font-medium text-primary truncate">{contact.name}</p>
          {(contact.position || contact.jobPosition || contact.company) && (
            <p className="typo-caption text-on-surface-variant/70 truncate">
              {[contact.position || contact.jobPosition, contact.company].filter(Boolean).join(" • ")}
            </p>
          )}
        </div>

      </div>

      {/* Email */}
      <div className="min-w-0 text-on-surface-variant typo-body-sm truncate">
        {contact.email ? (
          <a
            href={`mailto:${contact.email}`}
            className="hover:text-primary hover:underline transition-colors"
          >
            {contact.email}
          </a>
        ) : (
          <span className="text-on-surface-variant/40">—</span>
        )}
      </div>

      {/* Phone */}
      <div className="hidden sm:block min-w-0 text-on-surface-variant typo-body-sm truncate">
        {contact.phone ? (
          <a
            href={`tel:${contact.phone}`}
            className="hover:text-primary hover:underline transition-colors"
          >
            {contact.phone}
          </a>
        ) : (
          <span className="text-on-surface-variant/40">—</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1">
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(contact)}
            aria-label={`Редактировать ${contact.name}`}
            title="Редактировать"
            className="p-1.5 text-on-surface-variant hover:text-primary rounded hover:bg-surface-container transition-colors cursor-pointer"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(contact.id)}
            aria-label={`Удалить ${contact.name}`}
            title="Удалить"
            className="p-1.5 text-on-surface-variant hover:text-error rounded hover:bg-surface-container transition-colors cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
        {!onEdit && !onDelete && (
          <button
            type="button"
            aria-label="Действия с контактом"
            className="p-1.5 text-on-surface-variant hover:text-primary rounded hover:bg-surface-container transition-colors cursor-pointer"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
