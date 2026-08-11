/** Contact entity — mirrors server schema */
export interface Contact {
  id: number;
  user_id: number;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  position: string | null;
  created_at: string;
  updated_at: string;
}
