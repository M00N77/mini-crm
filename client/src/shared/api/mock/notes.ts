import { Note } from "@/entities/note";

export const MOCK_NOTES: Note[] = [
  {
    id: 1,
    user_id: 1,
    contact_id: 1,
    content: "Alice mentioned they are looking to upgrade their infrastructure by Q4. Follow up next month.",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    user_id: 1,
    contact_id: 1,
    content: "Prefers communication via email rather than calls.",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    user_id: 1,
    contact_id: 3,
    content: "Startup is growing fast. Might need enterprise plan soon.",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  }
];
