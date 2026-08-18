"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from "@/shared/ui";
import { useModalStore } from "@/shared/store/modal-store";
import { useCreateNote } from "@/entities/note";
import { useContacts } from "@/entities/contact";
import { StickyNote, User, AlignLeft } from "lucide-react";
import {
  createNoteSchema,
  CreateNoteFormData,
} from "../model/note-schema";

interface CreateNoteFormProps {
  initialContactId?: number;
  onClose: () => void;
}

function CreateNoteForm({ initialContactId, onClose }: CreateNoteFormProps) {
  const { data: contactsResponse, isLoading: isContactsLoading } = useContacts({
    limit: 100,
  });

  const contactsList = Array.isArray(contactsResponse)
    ? contactsResponse
    : contactsResponse?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateNoteFormData>({
    resolver: zodResolver(createNoteSchema),
    mode: "onBlur",
    defaultValues: {
      contactId: initialContactId || 0,
      content: "",
    },
  });

  const { mutate: createNote, isPending } = useCreateNote();

  const onSubmit = (data: CreateNoteFormData) => {
    createNote(
      {
        contactId: Number(data.contactId),
        content: data.content,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <form
      noValidate
      action="javascript:void(0);"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e);
      }}
      className="space-y-4 py-2 font-sans"
    >
      {/* Выбор контакта */}
      <div className="space-y-1">
        <label
          htmlFor="note-contact-select"
          className="text-xs font-mono text-text-secondary flex items-center gap-1.5"
        >
          <User className="h-3.5 w-3.5 text-text-tertiary" />
          КОНТАКТ <span className="text-status-danger">*</span>
        </label>
        <select
          id="note-contact-select"
          {...register("contactId", { valueAsNumber: true })}
          disabled={isContactsLoading}
          className={`w-full rounded-none border bg-subtle px-3 py-2 text-xs font-mono text-text-primary focus:outline-none transition-colors cursor-pointer ${
            errors.contactId
              ? "border-status-danger focus:border-status-danger"
              : "border-border-subtle focus:border-border-strong"
          }`}
        >
          <option value={0} disabled>
            {isContactsLoading
              ? "Загрузка списка контактов..."
              : "— Выберите контакт для прикрепления заметки —"}
          </option>
          {contactsList.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {contact.name} {contact.company ? `(${contact.company})` : ""}
            </option>
          ))}
        </select>
        {errors.contactId && (
          <p className="text-[11px] font-mono text-status-danger">{errors.contactId.message}</p>
        )}
      </div>

      {/* Текст заметки */}
      <div className="space-y-1">
        <label
          htmlFor="note-content"
          className="text-xs font-mono text-text-secondary flex items-center gap-1.5"
        >
          <AlignLeft className="h-3.5 w-3.5 text-text-tertiary" />
          ТЕКСТ ЗАМЕТКИ / ПРОТОКОЛА <span className="text-status-danger">*</span>
        </label>
        <textarea
          id="note-content"
          rows={4}
          placeholder="Запишите договоренности, результат звонка или важные детали..."
          {...register("content")}
          className={`w-full rounded-none border bg-subtle px-3 py-2 text-xs font-mono text-text-primary placeholder:text-text-tertiary focus:outline-none transition-colors resize-none ${
            errors.content
              ? "border-status-danger focus:border-status-danger"
              : "border-border-subtle focus:border-border-strong"
          }`}
        />
        {errors.content && (
          <p className="text-[11px] font-mono text-status-danger">{errors.content.message}</p>
        )}
      </div>

      <DialogFooter className="pt-3 gap-2 sm:gap-2 font-mono">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="rounded-none text-xs"
        >
          Отмена
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="rounded-none text-xs bg-accent text-accent-contrast hover:bg-accent-hover font-bold disabled:opacity-50"
        >
          {isPending ? "Сохранение..." : "Добавить заметку"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function CreateNoteModal() {
  const { isOpen, type, data, closeModal } = useModalStore();
  const isModalOpen = isOpen && type === "createNote";

  const initialContactId =
    data?.contactId ||
    (data?.defaultValues?.contactId as number | undefined) ||
    (data?.initialValues as Record<string, unknown> | undefined)?.contactId as
      | number
      | undefined;

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[500px] bg-surface border-border-strong text-text-primary rounded-none">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold text-text-primary flex items-center gap-2 font-mono">
            <StickyNote className="h-4.5 w-4.5 text-accent" />
            НОВАЯ ЗАМЕТКА
          </DialogTitle>
          <DialogDescription className="text-xs text-text-secondary">
            Создайте заметку и прикрепите её к контакту
          </DialogDescription>
        </DialogHeader>

        {isModalOpen && (
          <CreateNoteForm
            key={`${isModalOpen}-${initialContactId || "none"}`}
            initialContactId={initialContactId}
            onClose={closeModal}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
