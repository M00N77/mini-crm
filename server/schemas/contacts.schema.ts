import { z } from "zod";

export const createContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  company: z.string().optional().nullable(),
  jobPosition: z.string().optional().nullable(),
});

export const updateContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  company: z.string().optional().nullable(),
  jobPosition: z.string().optional().nullable(),
});
