"use client";

import type { Contact } from "../model/types";
import { Trash2, Edit2 } from "lucide-react";
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
        "grid grid-cols-[1.5fr_1.5fr_1fr_auto] gap-gutter px-gutter py-3 items-center border-b border-border-subtle hover:bg-subtle/70 transition-colors last:border-b-0 group",
        className
      )}
    >
      {/* Contact name & avatar */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="h-7 w-7 rounded-none bg-accent text-accent-contrast border border-accent-border flex items-center justify-center font-mono font-bold text-xs shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-text-primary truncate group-hover:text-accent transition-colors">
            {contact.name}
          </p>
          {(contact.position || contact.jobPosition || contact.company) && (
            <p className="text-[11px] text-text-tertiary font-mono truncate">
              {[contact.position || contact.jobPosition, contact.company].filter(Boolean).join(" • ")}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="min-w-0 text-text-secondary text-xs font-mono truncate">
        {contact.email ? (
          <a
            href={`mailto:${contact.email}`}
            className="hover:text-text-primary hover:underline transition-colors"
          >
            {contact.email}
          </a>
        ) : (
          <span className="text-text-tertiary/40">—</span>
        )}
      </div>

      {/* Phone */}
      <div className="hidden sm:block min-w-0 text-text-secondary text-xs font-mono truncate tabular-nums">
        {contact.phone ? (
          <a
            href={`tel:${contact.phone}`}
            className="hover:text-text-primary hover:underline transition-colors"
          >
            {contact.phone}
          </a>
        ) : (
          <span className="text-text-tertiary/40">—</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1 font-mono">
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(contact)}
            aria-label={`Редактировать ${contact.name}`}
            title="Редактировать"
            className="p-1.5 text-text-secondary hover:text-text-primary rounded-none hover:bg-muted transition-colors cursor-pointer"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(contact.id)}
            aria-label={`Удалить ${contact.name}`}
            title="Удалить"
            className="p-1.5 text-text-secondary hover:text-status-danger rounded-none hover:bg-status-danger/10 transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
