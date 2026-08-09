interface ContactEntity {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  job_position: string | null;
  user_id: number;
  created_at?: Date | string;
}

export class ContactDto {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  jobPosition: string | null;
  userId: number;
  createdAt?: string;

  constructor(model: ContactEntity) {
    this.id = model.id;
    this.name = model.name;
    this.email = model.email;
    this.phone = model.phone;
    this.company = model.company;
    this.jobPosition = model.job_position;
    this.userId = model.user_id;
    this.createdAt = model.created_at
      ? new Date(model.created_at).toISOString()
      : undefined;
  }
}