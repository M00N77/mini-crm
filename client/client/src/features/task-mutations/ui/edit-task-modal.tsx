"use client";

import { useState } from "react";
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
import { useTask, useUpdateTask, Task, TaskStatus } from "@/entities/task";
import { Edit3, AlignLeft, Flag, CheckSquare } from "lucide-react";

const STATUS_OPTIONS: { key: TaskStatus; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "in_progress", label: "In Progress" },
  { key: "done", label: "Done" },
];

interface EditTaskFormProps {
  initialData?: Partial<Task> | Record<string, unknown>;
  taskId?: number;
  onClose: () => void;
}

function EditTaskForm({ initialData, taskId, onClose }: EditTaskFormProps) {
  const [title, setTitle] = useState((initialData?.title as string) || "");
  const [description, setDescription] = useState(
    (initialData?.description as string) || ""
  );
  const [status, setStatus] = useState<TaskStatus>(
    (initialData?.status as TaskStatus) || "pending"
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: updateTask, isPending } = useUpdateTask();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrors({ title: "Название задачи обязательно" });
      return;
    }

    if (!taskId) return;

    updateTask(
      {
        id: taskId,
        payload: {
          title: title.trim(),
          description: description.trim() || null,
          status,
          position: (initialData?.position as number) ?? 0,
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
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      {/* Название */}
      <div className="space-y-1.5">
        <label
          htmlFor="edit-task-title"
          className="typo-caption font-medium text-on-surface flex items-center gap-1.5"
        >
          <CheckSquare className="h-3.5 w-3.5 text-on-surface-variant" />
          Название <span className="text-error">*</span>
        </label>
        <input
          id="edit-task-title"
          type="text"
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors({});
          }}
          placeholder="Название задачи"
          className={`w-full rounded border bg-surface-container px-3 py-2 typo-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none transition-colors ${
            errors.title
              ? "border-error focus:border-error"
              : "border-outline-variant focus:border-primary"
          }`}
        />
        {errors.title && <p className="typo-caption text-error">{errors.title}</p>}
      </div>

      {/* Статус / Колонка */}
      <div className="space-y-1.5">
        <label className="typo-caption font-medium text-on-surface flex items-center gap-1.5">
          <Flag className="h-3.5 w-3.5 text-on-surface-variant" />
          Колонка (Статус)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setStatus(opt.key)}
              className={`py-1.5 px-2 rounded border text-xs font-medium transition-colors cursor-pointer ${
                status === opt.key
                  ? "bg-primary text-on-primary border-primary"
                  : "bg-surface-container border-outline-variant text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Описание */}
      <div className="space-y-1.5">
        <label
          htmlFor="edit-task-description"
          className="typo-caption font-medium text-on-surface flex items-center gap-1.5"
        >
          <AlignLeft className="h-3.5 w-3.5 text-on-surface-variant" />
          Описание (опционально)
        </label>
        <textarea
          id="edit-task-description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Детали задачи..."
          className="w-full rounded border border-outline-variant bg-surface-container px-3 py-2 typo-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none transition-colors resize-none"
        />
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

export function EditTaskModal() {
  const { isOpen, type, data, closeModal } = useModalStore();
  const isModalOpen = isOpen && type === "editTask";
  const taskId = data?.id;

  const { data: fetchedTask, isLoading: isFetching } = useTask(taskId as number);
  const initialData = fetchedTask || data?.initialValues;

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[480px] bg-surface-container-lowest border-outline-variant text-on-surface">
        <DialogHeader>
          <DialogTitle className="typo-title-lg text-primary flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-primary" />
            Редактировать задачу
          </DialogTitle>
          <DialogDescription className="typo-caption text-on-surface-variant">
            Измените параметры задачи или переместите её в другую колонку
          </DialogDescription>
        </DialogHeader>

        {isFetching && !initialData ? (
          <div className="py-8 flex items-center justify-center">
            <Spinner size="md" label="Загрузка данных задачи..." />
          </div>
        ) : (
          <EditTaskForm
            key={`${taskId}-${initialData ? "loaded" : "init"}`}
            initialData={initialData}
            taskId={taskId}
            onClose={closeModal}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
