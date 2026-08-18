import { KanbanBoard } from "@/widgets/kanban-board";
import { CreateTaskButton } from "@/features/task-mutations";

export const metadata = { title: "Задачи — Nexus CRM" };

export default function TasksPage() {
  return (
    <div className="space-y-4 relative min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="typo-display text-primary">Задачи</h1>
          <p className="typo-caption text-on-surface-variant/70 mt-0.5">
            Канбан-доска и управление статусами задач
          </p>
        </div>
        <CreateTaskButton>
          Новая задача
        </CreateTaskButton>
      </div>

      <KanbanBoard />

      {/* Floating Action Button for mobile */}
      <CreateTaskButton variant="fab" />
    </div>
  );
}
