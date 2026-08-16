"use client";

import { Plus } from "lucide-react";
import type { TaskStatus } from "@/entities/task";

const COLUMNS: { key: TaskStatus; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "in_progress", label: "In Progress" },
  { key: "done", label: "Done" },
];

export function KanbanBoard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
      {COLUMNS.map((col) => (
        <div
          key={col.key}
          className="flex flex-col gap-stack-sm rounded-lg border border-outline-variant bg-surface-container-lowest p-gutter min-h-[220px]"
        >
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
            <div className="flex items-center gap-2">
              <h3 className="typo-body-lg text-primary font-medium">{col.label}</h3>
              <span className="typo-label-mono text-on-surface-variant bg-surface-container px-2 py-0.5 rounded text-[11px]">
                0
              </span>
            </div>
            <button
              type="button"
              aria-label={`Добавить задачу в ${col.label}`}
              className="text-on-surface-variant hover:text-primary p-1 rounded hover:bg-surface-container transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Empty state / Task list */}
          <div className="flex-1 flex items-center justify-center text-on-surface-variant/50 typo-caption py-8">
            Нет задач
          </div>

          {/* Add Task Button at column bottom */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded border border-dashed border-outline-variant/60 transition-colors cursor-pointer mt-auto"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Добавить задачу</span>
          </button>
        </div>
      ))}
    </div>
  );
}
