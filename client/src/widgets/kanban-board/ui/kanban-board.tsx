"use client";

import { useState, useMemo } from "react";
import { Plus, AlertCircle, Inbox } from "lucide-react";
import {
  useTasks,
  usePatchTask,
  useDeleteTask,
  Task,
  TaskStatus,
  TaskCard,
} from "@/entities/task";
import { Spinner } from "@/shared/ui";
import { useModalStore } from "@/shared/store/modal-store";
import { cn } from "@/shared/lib";

const COLUMNS: { key: TaskStatus; label: string; dotColor: string }[] = [
  { key: "pending", label: "Pending", dotColor: "bg-amber-500" },
  { key: "in_progress", label: "In Progress", dotColor: "bg-blue-500" },
  { key: "done", label: "Done", dotColor: "bg-emerald-500" },
];

export function KanbanBoard() {
  const { openModal } = useModalStore();

  const { data: response, isLoading, isError, error } = useTasks({
    limit: 100,
  });

  const { mutate: patchTask } = usePatchTask();
  const { mutate: deleteTask } = useDeleteTask();

  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const rawTasks = useMemo(() => {
    if (Array.isArray(response)) return response;
    return response?.data || [];
  }, [response]);

  // Группировка задач по колонкам
  const tasksByColumn = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      pending: [],
      in_progress: [],
      done: [],
    };

    rawTasks.forEach((task) => {
      const statusKey = (task.status as TaskStatus) || "pending";
      if (grouped[statusKey]) {
        grouped[statusKey].push(task);
      } else {
        grouped.pending.push(task);
      }
    });

    return grouped;
  }, [rawTasks]);

  // Drag-and-Drop обработчики
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.setData("text/plain", String(task.id));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, columnKey: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverColumn !== columnKey) {
      setDragOverColumn(columnKey);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);

    const taskId =
      Number(e.dataTransfer.getData("text/plain")) || draggedTask?.id;

    if (!taskId) return;

    if (draggedTask && draggedTask.status === targetStatus) {
      setDraggedTask(null);
      return;
    }

    patchTask({
      id: taskId,
      payload: { status: targetStatus },
    });

    setDraggedTask(null);
  };

  const handleCreateTask = (statusKey: TaskStatus) => {
    openModal("createTask", {
      defaultValues: { status: statusKey },
    });
  };

  const handleEditTask = (task: Task) => {
    openModal("editTask", {
      id: task.id,
      initialValues: task,
    });
  };

  const handleDeleteTask = (id: number) => {
    const task = rawTasks.find((t) => t.id === id);
    const taskTitle = task?.title ? `«${task.title}»` : "эту задачу";

    openModal("confirmDelete", {
      title: "Удалить задачу?",
      description: `Вы действительно хотите удалить задачу ${taskTitle}? Это действие нельзя отменить.`,
      confirmText: "Да, удалить",
      cancelText: "Отмена",
      variant: "destructive",
      onConfirm: async () => {
        deleteTask(id);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" label="Загрузка Канбан-доски..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 rounded-lg border border-error/30 bg-error-container/20 flex flex-col items-center justify-center text-center gap-2">
        <AlertCircle className="h-6 w-6 text-error" />
        <p className="typo-body-sm text-error font-medium">
          Ошибка при загрузке задач
        </p>
        <p className="typo-caption text-on-surface-variant/70">
          {error instanceof Error ? error.message : "Не удалось получить список задач"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter items-start">
      {COLUMNS.map((col) => {
        const columnTasks = tasksByColumn[col.key] || [];
        const isColumnDragOver = dragOverColumn === col.key;

        return (
          <div
            key={col.key}
            onDragOver={(e) => handleDragOver(e, col.key)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.key)}
            className={cn(
              "flex flex-col gap-3 rounded-lg border border-outline-variant bg-surface-container-lowest p-3.5 min-h-[420px] transition-all duration-150 shadow-xs",
              isColumnDragOver &&
                "border-primary/80 bg-primary/5 ring-2 ring-primary/20 scale-[1.005]"
            )}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/60">
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", col.dotColor)} />
                <h3 className="typo-body-lg text-primary font-medium text-sm">
                  {col.label}
                </h3>
                <span className="typo-label-mono text-on-surface-variant bg-surface-container px-2 py-0.5 rounded text-[11px] font-semibold">
                  {columnTasks.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCreateTask(col.key)}
                aria-label={`Добавить задачу в ${col.label}`}
                title={`Добавить задачу в ${col.label}`}
                className="text-on-surface-variant hover:text-primary p-1 rounded hover:bg-surface-container transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Tasks List */}
            <div className="flex-1 flex flex-col gap-2.5 min-h-[120px]">
              {columnTasks.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-on-surface-variant/40 border border-dashed border-outline-variant/40 rounded-lg">
                  <Inbox className="h-5 w-5 mb-1 opacity-50" />
                  <p className="typo-caption text-xs">Нет задач</p>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    className={
                      draggedTask?.id === task.id ? "opacity-40 scale-95" : ""
                    }
                  />
                ))
              )}
            </div>

            {/* Add Task Button at Bottom */}
            <button
              type="button"
              onClick={() => handleCreateTask(col.key)}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded border border-dashed border-outline-variant/60 hover:border-primary/50 transition-colors cursor-pointer mt-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Добавить задачу</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
