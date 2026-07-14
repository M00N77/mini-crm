import { z } from "zod";

export const createNoteSchema = z.object({
  content: z.string().min(1, "Content is required"),
  contactId: z.number().positive("ContactId must be a positive number"),
});

export const updateNoteSchema = z.object({
  content: z.string().min(1, "Content is required"),
});
