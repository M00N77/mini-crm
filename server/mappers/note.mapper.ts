interface NoteEntity {
  id: number;
  content: string;
  contact_id: number;
  created_at?: Date | string;
}

export class NoteDto {
  id: number;
  content: string;
  contactId: number;
  createdAt?: string;

  constructor(model: NoteEntity) {
    this.id = model.id;
    this.content = model.content;
    this.contactId = model.contact_id;
    this.createdAt = model.created_at
      ? new Date(model.created_at).toISOString()
      : undefined;
  }
}