/** Note entity — mirrors server schema */
export interface Note {
  id: number;
  user_id: number;
  contact_id: number;
  content: string;
  created_at: string;
  updated_at: string;
}
