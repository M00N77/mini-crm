/** Task statuses — matches server enum */
export type TaskStatus = "pending" | "in_progress" | "done";

/** Task entity — mirrors server schema */
export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  position?: number;
  userId?: number;
  user_id?: number;
  contactId?: number | null;
  contact_id?: number | null;
  dueDate?: string | null;
  due_date?: string | null;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}
