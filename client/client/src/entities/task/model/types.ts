/** Task statuses — matches server enum */
export type TaskStatus = "pending" | "in_progress" | "done";

/** Task entity — mirrors server schema */
export interface Task {
  id: number;
  user_id: number;
  contact_id: number | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}
