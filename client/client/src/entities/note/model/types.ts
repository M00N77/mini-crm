/** Note entity — mirrors server schema */
export interface Note {
  id: number;
  content: string;
  contactId?: number;
  contact_id?: number;
  userId?: number;
  user_id?: number;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}
