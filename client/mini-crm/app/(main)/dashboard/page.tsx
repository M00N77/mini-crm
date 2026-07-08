'use client';

import { useState } from 'react';
import { DashboardView } from '@/src/components/pages/DashboardView';
import {
  MOCK_STATS,
  MOCK_RECENT_CONTACTS,
  MOCK_PIPELINE,
  MOCK_UP_NEXT,
} from '@/src/lib/mock';

export default function DashboardPage() {
  const [taskValue, setTaskValue] = useState('');

  return (
    <DashboardView
      stats={MOCK_STATS}
      recentContacts={MOCK_RECENT_CONTACTS}
      pipeline={MOCK_PIPELINE}
      upNext={MOCK_UP_NEXT}
      taskValue={taskValue}
      onTaskChange={setTaskValue}
      onAddTask={() => {
        console.log('Add task:', taskValue);
        setTaskValue('');
      }}
    />
  );
}
