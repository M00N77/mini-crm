import { User } from "@/entities/user";

export const MOCK_USERS: User[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@nexuscrm.local",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@nexuscrm.local",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  }
];
