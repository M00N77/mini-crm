'use client';

import { TasksView } from '@/src/components/pages/TasksView';
import { MOCK_TASKS_COLUMNS } from '@/src/lib/mock';

export default function TasksPage() {
  return (
    <TasksView
      columns={MOCK_TASKS_COLUMNS}
      onNewTask={() => console.log('New task')}
    />
  );
}
