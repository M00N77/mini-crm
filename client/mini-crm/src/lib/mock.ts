import type { Contact, Task, Notes } from '@/src/types/types';

export type { Contact, Task, Notes };

export const MOCK_USER = 'Jordan Maye';
export const MOCK_USER_EMAIL = 'jordan@halo-crm.io';

export const MOCK_STATS = [
  { label: 'Total Contacts', value: 6, delta: '+12%' },
  { label: 'Pending Tasks', value: 4, delta: '+4%' },
  { label: 'Completed', value: 2, delta: '+18%' },
];

export const MOCK_RECENT_CONTACTS = [
  { id: 'c1', name: 'Ava Mercer', role: 'Head of Growth', company: 'Northwind', lastActive: '2 min ago' },
  { id: 'c2', name: 'Diego Santos', role: 'Sales Manager', company: 'Lumeworks', lastActive: '15 min ago' },
  { id: 'c3', name: 'Priya Nair', role: 'VP Engineering', company: 'Vertex Labs', lastActive: '1 hour ago' },
  { id: 'c4', name: 'Marcus Cole', role: 'CTO', company: 'Drift Studio', lastActive: '3 hours ago' },
];

export const MOCK_PIPELINE = [
  { label: 'Todo' as const, count: 2 },
  { label: 'In Progress' as const, count: 2 },
  { label: 'Done' as const, count: 2 },
];

export const MOCK_UP_NEXT = [
  { id: 'u1', title: 'Send security questionnaire to Northwind' },
  { id: 'u2', title: 'Draft Lumeworks proposal' },
  { id: 'u3', title: 'Schedule demo with Vertex Labs' },
  { id: 'u4', title: 'Follow up on Drift Studio deck' },
];

export const MOCK_CONTACTS = [
  {
    id: 'c1',
    name: 'Ava Mercer',
    role: 'Head of Growth',
    company: 'Northwind',
    email: 'ava@northwind.io',
    phone: '+1 415 552-0188',
    notesCount: 2,
  },
  {
    id: 'c2',
    name: 'Diego Santos',
    role: 'Sales Manager',
    company: 'Lumeworks',
    email: 'diego@lumeworks.io',
    phone: '+1 415 555-0102',
    notesCount: 0,
  },
  {
    id: 'c3',
    name: 'Priya Nair',
    role: 'VP Engineering',
    company: 'Vertex Labs',
    email: 'priya@vertexlabs.com',
    phone: '+1 415 555-0103',
    notesCount: 0,
  },
  {
    id: 'c4',
    name: 'Marcus Cole',
    role: 'CTO',
    company: 'Drift Studio',
    email: 'marcus@driftstudio.io',
    phone: '+1 415 555-0104',
    notesCount: 0,
  },
  {
    id: 'c5',
    name: 'Lena Fischer',
    role: 'Product Lead',
    company: 'Nexa',
    email: 'lena@nexa.io',
    phone: '+1 415 555-0105',
    notesCount: 0,
  },
  {
    id: 'c6',
    name: 'Toby Wong',
    role: 'Operations Director',
    company: 'Zenflow',
    email: 'toby@zenflow.co',
    phone: '+1 415 555-0106',
    notesCount: 0,
  },
];

export interface NotePreview {
  text: string;
  timeAgo: string;
}

export const MOCK_CONTACT_NOTES: Record<string, NotePreview[]> = {
  c1: [
    { text: 'Initial outreach completed, positive response — wants to see a demo', timeAgo: '2 days ago' },
    { text: 'Follow-up call scheduled for next Thursday', timeAgo: '1 hour ago' },
  ],
};

export const MOCK_TASKS_COLUMNS = [
  {
    id: 'todo',
    title: 'Todo' as const,
    variant: 'info' as const,
    tasks: [
      { id: 't1', title: 'Send security questionnaire to Northwind', description: 'Prepare and send vendor security assessment', status: 'Todo' as const },
      { id: 't2', title: 'Draft Lumeworks proposal', description: 'Outline partnership terms and pricing model', status: 'Todo' as const },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress' as const,
    variant: 'warning' as const,
    tasks: [
      { id: 't3', title: 'Schedule demo with Vertex Labs', description: 'Confirm availability with engineering team', status: 'In Progress' as const },
      { id: 't4', title: 'Follow up on Drift Studio deck', description: 'Review feedback from last presentation', status: 'In Progress' as const },
    ],
  },
  {
    id: 'done',
    title: 'Done' as const,
    variant: 'success' as const,
    tasks: [
      { id: 't5', title: 'Initial Northwind discovery call', description: 'Completed, requirements documented', status: 'Done' as const },
      { id: 't6', title: 'Lumeworks NDA signing', description: 'Signed and returned by both parties', status: 'Done' as const },
    ],
  },

];
