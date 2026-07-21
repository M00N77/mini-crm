import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password too long"),
  name: z.string().min(4, "Name must be at least 4 characters"),
});
