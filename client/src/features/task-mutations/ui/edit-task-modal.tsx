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
  { key: "pending", label: "QUEUE" },
  { key: "in_progress", label: "PROG" },
  { key: "done", label: "DONE" },
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
    <form onSubmit={handleSubmit} className="space-y-4 py-2 font-sans">
      {/* Название */}
      <div className="space-y-1">
        <label
          htmlFor="edit-task-title"
          className="text-xs font-mono text-text-secondary flex items-center gap-1.5"
        >
          <CheckSquare className="h-3.5 w-3.5 text-text-tertiary" />
          НАЗВАНИЕ ЗАДАЧИ <span className="text-status-danger">*</span>
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
          className={`w-full rounded-none border bg-subtle px-3 py-2 text-xs font-mono text-text-primary placeholder:text-text-tertiary focus:outline-none transition-colors ${
            errors.title
              ? "border-status-danger focus:border-status-danger"
              : "border-border-subtle focus:border-border-strong"
          }`}
        />
        {errors.title && <p className="text-[11px] font-mono text-status-danger">{errors.title}</p>}
      </div>

      {/* Статус / Колонка */}
      <div className="space-y-1">
        <label className="text-xs font-mono text-text-secondary flex items-center gap-1.5">
          <Flag className="h-3.5 w-3.5 text-text-tertiary" />
          СТАТУС (КОЛОНКА)
        </label>
        <div className="grid grid-cols-3 gap-2 font-mono">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setStatus(opt.key)}
              className={`py-1.5 px-2 rounded-none border text-xs font-bold transition-colors cursor-pointer ${
                status === opt.key
                  ? "bg-accent text-accent-contrast border-accent"
                  : "bg-subtle border-border-subtle text-text-secondary hover:text-text-primary"
              }`}
            >
              [{opt.label}]
            </button>
          ))}
        </div>
      </div>

      {/* Описание */}
      <div className="space-y-1">
        <label
          htmlFor="edit-task-description"
          className="text-xs font-mono text-text-secondary flex items-center gap-1.5"
        >
          <AlignLeft className="h-3.5 w-3.5 text-text-tertiary" />
          ОПИСАНИЕ (ОПЦИОНАЛЬНО)
        </label>
        <textarea
          id="edit-task-description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Детали задачи..."
          className="w-full rounded-none border border-border-subtle bg-subtle px-3 py-2 text-xs font-mono text-text-primary placeholder:text-text-tertiary focus:border-border-strong focus:outline-none transition-colors resize-none"
        />
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

export function EditTaskModal() {
  const { isOpen, type, data, closeModal } = useModalStore();
  const isModalOpen = isOpen && type === "editTask";
  const taskId = data?.id;

  const { data: fetchedTask, isLoading: isFetching } = useTask(taskId as number);
  const initialData = fetchedTask || data?.initialValues;

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[480px] bg-surface border-border-strong text-text-primary rounded-none">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold text-text-primary flex items-center gap-2 font-mono">
            <Edit3 className="h-4.5 w-4.5 text-accent" />
            РЕДАКТИРОВАТЬ ЗАДАЧУ
          </DialogTitle>
          <DialogDescription className="text-xs text-text-secondary">
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
