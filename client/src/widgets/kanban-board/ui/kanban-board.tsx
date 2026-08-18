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

const COLUMNS: { key: TaskStatus; label: string; code: string; dotColor: string }[] = [
  { key: "pending", label: "В очереди", code: "QUEUE", dotColor: "bg-text-tertiary" },
  { key: "in_progress", label: "В работе", code: "PROG", dotColor: "bg-accent" },
  { key: "done", label: "Завершено", code: "DONE", dotColor: "bg-status-success" },
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
      <div className="p-8 rounded-none border border-status-danger/30 bg-status-danger-bg flex flex-col items-center justify-center text-center gap-2">
        <AlertCircle className="h-6 w-6 text-status-danger" />
        <p className="text-sm font-semibold text-status-danger">
          Ошибка при загрузке задач
        </p>
        <p className="text-xs font-mono text-text-tertiary">
          {error instanceof Error ? error.message : "Не удалось получить список задач"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
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
              "flex flex-col gap-3 rounded-none border border-border-subtle bg-surface p-3.5 min-h-[440px] transition-all duration-150 shadow-2xs",
              isColumnDragOver &&
                "border-accent bg-accent-subtle/30 ring-1 ring-accent/40"
            )}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-border-subtle">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className={cn("h-2 w-2 rounded-none", col.dotColor)} />
                <span className="font-bold text-text-primary tracking-wide">
                  {col.label}
                </span>
                <span className="text-[10px] text-text-tertiary px-1.5 py-0.2 rounded-none bg-subtle border border-border-subtle tabular-nums font-bold">
                  {columnTasks.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCreateTask(col.key)}
                aria-label={`Добавить задачу в ${col.label}`}
                title={`Добавить задачу в ${col.label}`}
                className="text-text-secondary hover:text-text-primary p-1 rounded-none hover:bg-subtle transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Tasks List */}
            <div className="flex-1 flex flex-col gap-2 min-h-[120px]">
              {columnTasks.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-text-tertiary border border-dashed border-border-subtle rounded-none font-mono text-xs">
                  <Inbox className="h-4 w-4 mb-1 opacity-40" />
                  <span>// НЕТ ЗАДАЧ</span>
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
                      draggedTask?.id === task.id ? "opacity-30 scale-95" : ""
                    }
                  />
                ))
              )}
            </div>

            {/* Add Task Button at Bottom */}
            <button
              type="button"
              onClick={() => handleCreateTask(col.key)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-mono text-text-secondary hover:text-text-primary hover:bg-subtle rounded-none border border-dashed border-border-subtle hover:border-border-strong transition-colors cursor-pointer mt-auto"
            >
              <Plus className="h-3 w-3" />
              <span>+ ДОБАВИТЬ ЗАДАЧУ</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
