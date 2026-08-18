export interface UserPayload {
  id: number;
  email: string;
  name?: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: UserPayload;
  accessToken: string;
}

export interface PayloadLogin {
  email: string;
  password: string;
}

export interface PayloadRegister {
  email: string;
  password: string;
  name: string;
}
