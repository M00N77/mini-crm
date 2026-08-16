"use client";

import { Task } from "../model/types";
import { Edit2, Trash2, GripVertical, Calendar } from "lucide-react";
import { cn } from "@/shared/lib";

interface TaskCardProps {
  task: Task;
  className?: string;
  onEdit?: (task: Task) => void;
  onDelete?: (id: number) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, task: Task) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function TaskCard({
  task,
  className,
  onEdit,
  onDelete,
  draggable = true,
  onDragStart,
  onDragEnd,
}: TaskCardProps) {
  const formattedDate = task.createdAt || task.created_at
    ? new Date(task.createdAt || task.created_at!).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
      })
    : null;

  return (
    <div
      draggable={draggable}
      onDragStart={(e) => onDragStart?.(e, task)}
      onDragEnd={onDragEnd}
      className={cn(
        "group relative rounded-lg border border-outline-variant bg-surface-container-lowest p-3.5 shadow-xs hover:border-outline transition-all duration-150 cursor-grab active:cursor-grabbing select-none flex flex-col gap-2.5",
        className
      )}
    >
      {/* Header: Grip + Title + Actions */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-1.5 min-w-0 flex-1">
          <GripVertical className="h-4 w-4 text-on-surface-variant/40 group-hover:text-on-surface-variant/70 shrink-0 mt-0.5" />
          <h4 className="typo-body-sm font-medium text-primary leading-snug break-words">
            {task.title}
          </h4>
        </div>

        {/* Edit & Delete Action Buttons */}
        <div className="flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              aria-label={`Редактировать ${task.title}`}
              title="Редактировать"
              className="p-1 text-on-surface-variant hover:text-primary rounded hover:bg-surface-container transition-colors cursor-pointer"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              aria-label={`Удалить ${task.title}`}
              title="Удалить"
              className="p-1 text-on-surface-variant hover:text-error rounded hover:bg-surface-container transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="typo-caption text-on-surface-variant/80 line-clamp-3 text-xs pl-5 whitespace-pre-wrap">
          {task.description}
        </p>
      )}

      {/* Footer: Date badge */}
      {formattedDate && (
        <div className="flex items-center justify-between pt-1 text-[11px] text-on-surface-variant/60 pl-5">
          <span className="flex items-center gap-1 font-label-mono">
            <Calendar className="h-3 w-3" />
            {formattedDate}
          </span>
        </div>
      )}
    </div>
  );
}
