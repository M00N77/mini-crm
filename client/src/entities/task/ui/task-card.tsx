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
        "group relative rounded-none border border-border-subtle bg-surface p-3 shadow-2xs hover:border-border-strong transition-all duration-150 cursor-grab active:cursor-grabbing select-none flex flex-col gap-2",
        className
      )}
    >
      {/* Header: Grip + Mono ID + Actions */}
      <div className="flex items-center justify-between gap-1.5 font-mono text-[10px]">
        <div className="flex items-center gap-1 text-text-tertiary">
          <GripVertical className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100" />
          <span className="text-text-tertiary font-bold group-hover:text-accent transition-colors">
            TSK-{String(task.id).padStart(3, "0")}
          </span>
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
              className="p-1 text-text-secondary hover:text-text-primary rounded-none hover:bg-muted transition-colors cursor-pointer"
            >
              <Edit2 className="h-3 w-3" />
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
              className="p-1 text-text-secondary hover:text-status-danger rounded-none hover:bg-status-danger/10 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Task Title */}
      <h4 className="text-xs font-medium text-text-primary leading-snug break-words pl-4">
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="text-[11px] text-text-secondary line-clamp-3 pl-4 whitespace-pre-wrap">
          {task.description}
        </p>
      )}

      {/* Footer: Date badge */}
      {formattedDate && (
        <div className="flex items-center justify-between pt-1 border-t border-border-subtle text-[10px] text-text-tertiary pl-4 font-mono">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formattedDate}
          </span>
        </div>
      )}
    </div>
  );
}
