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
      className="space-y-4 py-2 font-sans"
    >
      {/* Текст заметки */}
      <div className="space-y-1">
        <label
          htmlFor="edit-note-content"
          className="text-xs font-mono text-text-secondary flex items-center gap-1.5"
        >
          <AlignLeft className="h-3.5 w-3.5 text-text-tertiary" />
          ТЕКСТ ЗАМЕТКИ / ПРОТОКОЛА <span className="text-status-danger">*</span>
        </label>
        <textarea
          id="edit-note-content"
          rows={5}
          placeholder="Текст заметки..."
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
      <DialogContent 
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-[500px] bg-surface border-border-strong text-text-primary rounded-none"
      >
        <DialogHeader>
          <DialogTitle className="text-sm font-bold text-text-primary flex items-center gap-2 font-mono">
            <Edit3 className="h-4.5 w-4.5 text-accent" />
            РЕДАКТИРОВАТЬ ЗАМЕТКУ
          </DialogTitle>
          <DialogDescription className="text-xs text-text-secondary">
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
