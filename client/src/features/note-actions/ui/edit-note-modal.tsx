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
  Spinner,
} from "@/shared/ui";
import { useModalStore } from "@/shared/store/modal-store";
import { useNote, useUpdateNote, Note } from "@/entities/note";
import { Edit3, AlignLeft } from "lucide-react";
import {
  updateNoteSchema,
  UpdateNoteFormData,
} from "../model/note-schema";

interface EditNoteFormProps {
  initialData?: Partial<Note> | Record<string, unknown>;
  noteId?: number;
  onClose: () => void;
}

function EditNoteForm({ initialData, noteId, onClose }: EditNoteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateNoteFormData>({
    resolver: zodResolver(updateNoteSchema),
    mode: "onBlur",
    defaultValues: {
      content: (initialData?.content as string) || "",
    },
  });

  const { mutate: updateNote, isPending } = useUpdateNote();

  const onSubmit = (data: UpdateNoteFormData) => {
    if (!noteId) return;

    updateNote(
      {
        id: noteId,
        payload: {
          content: data.content,
        },
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
      {/* Текст заметки */}
      <div className="space-y-1.5">
        <label
          htmlFor="edit-note-content"
          className="typo-caption font-medium text-on-surface flex items-center gap-1.5"
        >
          <AlignLeft className="h-3.5 w-3.5 text-on-surface-variant" />
          Текст заметки <span className="text-error">*</span>
        </label>
        <textarea
          id="edit-note-content"
          rows={5}
          placeholder="Текст заметки..."
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
          {isPending ? "Сохранение..." : "Сохранить изменения"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function EditNoteModal() {
  const { isOpen, type, data, closeModal } = useModalStore();
  const isModalOpen = isOpen && type === "editNote";
  const noteId = data?.id || data?.noteId;

  const { data: fetchedNote, isLoading: isFetching } = useNote(
    noteId as number
  );

  const initialData = fetchedNote || data?.initialValues;

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[500px] bg-surface-container-lowest border-outline-variant text-on-surface">
        <DialogHeader>
          <DialogTitle className="typo-title-lg text-primary flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-primary" />
            Редактировать заметку
          </DialogTitle>
          <DialogDescription className="typo-caption text-on-surface-variant">
            Измените текст заметки и сохраните изменения
          </DialogDescription>
        </DialogHeader>

        {isFetching && !initialData ? (
          <div className="py-8 flex items-center justify-center">
            <Spinner size="md" label="Загрузка данных заметки..." />
          </div>
        ) : (
          <EditNoteForm
            key={`${noteId}-${initialData ? "loaded" : "init"}`}
            initialData={initialData}
            noteId={noteId as number}
            onClose={closeModal}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
