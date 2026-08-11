"use client";

import type { TaskStatus } from "@/entities/task";

// TODO: Wire to TanStack Query + drag-and-drop (dnd-kit)
// Imports: entities/task (TaskCard), features/task-mutations

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
          className="flex flex-col gap-stack-sm rounded-lg border border-outline-variant bg-surface-container-lowest p-gutter min-h-[200px]"
        >
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
            <h3 className="typo-body-lg text-primary font-medium">{col.label}</h3>
            <span className="typo-label-mono text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
              0
            </span>
          </div>

          {/* TODO: TaskCard entities go here */}
          <div className="flex-1 flex items-center justify-center text-on-surface-variant/50 typo-caption">
            Нет задач
          </div>
        </div>
      ))}
    </div>
  );
}
