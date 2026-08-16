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
      className="space-y-4 py-2"
    >
      {/* Выбор контакта */}
      <div className="space-y-1.5">
        <label
          htmlFor="note-contact-select"
          className="typo-caption font-medium text-on-surface flex items-center gap-1.5"
        >
          <User className="h-3.5 w-3.5 text-on-surface-variant" />
          Контакт <span className="text-error">*</span>
        </label>
        <select
          id="note-contact-select"
          {...register("contactId", { valueAsNumber: true })}
          disabled={isContactsLoading}
          className={`w-full rounded border bg-surface-container px-3 py-2 typo-body-sm text-on-surface focus:outline-none transition-colors cursor-pointer ${
            errors.contactId
              ? "border-error focus:border-error"
              : "border-outline-variant focus:border-primary"
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
          <p className="typo-caption text-error">{errors.contactId.message}</p>
        )}
      </div>

      {/* Текст заметки */}
      <div className="space-y-1.5">
        <label
          htmlFor="note-content"
          className="typo-caption font-medium text-on-surface flex items-center gap-1.5"
        >
          <AlignLeft className="h-3.5 w-3.5 text-on-surface-variant" />
          Текст заметки <span className="text-error">*</span>
        </label>
        <textarea
          id="note-content"
          rows={4}
          placeholder="Запишите договоренности, результат звонка или важные детали..."
          {...register("content")}
          className={`w-full rounded border bg-surface-container px-3 py-2 typo-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none transition-colors resize-none ${
            errors.content
              ? "border-error focus:border-error"
              : "border-outline-variant focus:border-primary"
          }`}
        />
        {errors.content && (
          <p className="typo-caption text-error">{errors.content.message}</p>
        )}
      </div>

      <DialogFooter className="pt-3 gap-2 sm:gap-0">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="border-outline-variant text-on-surface hover:bg-surface-container"
        >
          Отмена
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-50"
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
      <DialogContent className="sm:max-w-[500px] bg-surface-container-lowest border-outline-variant text-on-surface">
        <DialogHeader>
          <DialogTitle className="typo-title-lg text-primary flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-primary" />
            Новая заметка
          </DialogTitle>
          <DialogDescription className="typo-caption text-on-surface-variant">
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
