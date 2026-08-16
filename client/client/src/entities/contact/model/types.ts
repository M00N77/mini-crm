/** Contact entity — mirrors server schema */
export interface Contact {
  id: number;
  user_id?: number;
  userId?: number;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  position?: string | null;
  jobPosition?: string | null;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
}
