import { Task } from "@/entities/task";

export const MOCK_TASKS: Task[] = [
  {
    id: 1,
    user_id: 1,
    contact_id: 1,
    title: "Follow up on Q3 proposal",
    description: "Discuss the revised budget and timeline for the upcoming TechFlow integration.",
    status: "pending",
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    user_id: 1,
    contact_id: 3,
    title: "Send contract draft",
    description: "Needs to be reviewed by legal before sending to Charlie.",
    status: "in_progress",
    due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    user_id: 1,
    contact_id: 2,
    title: "Site visit preparation",
    description: null,
    status: "done",
    due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    user_id: 1,
    contact_id: null,
    title: "Internal sync regarding new features",
    description: "Prepare presentation slides.",
    status: "pending",
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  }
];
