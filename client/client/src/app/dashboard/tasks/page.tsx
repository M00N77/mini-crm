import { KanbanBoard } from "@/widgets/kanban-board";

export const metadata = { title: "Задачи — Nexus CRM" };

export default function TasksPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="typo-display text-primary">Задачи</h1>
        {/* TODO: CreateTaskButton from features/task-mutations */}
      </div>
      <KanbanBoard />
    </div>
  );
}
