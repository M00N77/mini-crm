"use client";

import type { Contact } from "../model/types";
import { Mail, Phone, Building2, User as UserIcon, MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/shared/lib";

interface ContactCardProps {
  contact: Contact;
  className?: string;
  onEdit?: (contact: Contact) => void;
  onDelete?: (id: number) => void;
}

export function ContactCard({ contact, className, onEdit, onDelete }: ContactCardProps) {
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
        "rounded-lg border border-outline-variant bg-surface-container-lowest p-4 flex flex-col justify-between gap-3 hover:border-outline transition-colors",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary font-medium typo-body-sm shrink-0">
            {initials || <UserIcon className="h-5 w-5 text-on-surface-variant" />}
          </div>
          <div className="min-w-0">
            <h3 className="typo-body-lg text-primary font-medium truncate">{contact.name}</h3>
            {(contact.position || contact.jobPosition || contact.company) && (
              <p className="typo-caption text-on-surface-variant/70 truncate">
                {[contact.position || contact.jobPosition, contact.company].filter(Boolean).join(" • ")}
              </p>
            )}
          </div>

        </div>

        <div className="flex items-center gap-1 shrink-0">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(contact)}
              aria-label={`Редактировать ${contact.name}`}
              className="p-1 text-on-surface-variant hover:text-primary rounded hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(contact.id)}
              aria-label={`Удалить ${contact.name}`}
              className="p-1 text-on-surface-variant hover:text-error rounded hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          {!onEdit && !onDelete && (
            <button
              type="button"
              aria-label="Опции"
              className="p-1 text-on-surface-variant hover:text-primary rounded hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-1.5 pt-2 border-t border-outline-variant/60">
        {contact.email && (
          <div className="flex items-center gap-2 text-on-surface-variant typo-body-sm truncate">
            <Mail className="h-3.5 w-3.5 shrink-0 text-on-surface-variant/60" />
            <a href={`mailto:${contact.email}`} className="truncate hover:text-primary transition-colors">
              {contact.email}
            </a>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center gap-2 text-on-surface-variant typo-body-sm truncate">
            <Phone className="h-3.5 w-3.5 shrink-0 text-on-surface-variant/60" />
            <a href={`tel:${contact.phone}`} className="truncate hover:text-primary transition-colors">
              {contact.phone}
            </a>
          </div>
        )}
        {contact.company && !contact.position && (
          <div className="flex items-center gap-2 text-on-surface-variant typo-body-sm truncate">
            <Building2 className="h-3.5 w-3.5 shrink-0 text-on-surface-variant/60" />
            <span className="truncate">{contact.company}</span>
          </div>
        )}
      </div>
    </div>
  );
}
