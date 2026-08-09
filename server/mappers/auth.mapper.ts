interface UserEntity {
  id: number;
  name?: string;
  email: string;
  created_at?: Date | string;
}

export class UserDto {
  id: number;
  name?: string;
  email: string;
  createdAt?: string;

  constructor(model: UserEntity) {
    this.id = model.id;
    this.name = model.name;
    this.email = model.email;
    this.createdAt = model.created_at
      ? new Date(model.created_at).toISOString()
      : undefined;
  }
}