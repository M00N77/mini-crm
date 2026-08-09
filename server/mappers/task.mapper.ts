interface TaskEntity {
  id: number;
  title: string;
  description: string | null;
  user_id: number;
  status: string;
  position: number;
  created_at?: Date | string;
}

export class TaskDto {
  id: number;
  title: string;
  description: string | null;
  userId: number;
  status: string;
  position: number;
  createdAt?: string;

  constructor(model: TaskEntity) {
    this.id = model.id;
    this.title = model.title;
    this.description = model.description;
    this.userId = model.user_id;
    this.status = model.status;
    this.position = model.position;
    this.createdAt = model.created_at
      ? new Date(model.created_at).toISOString()
      : undefined;
  }
}