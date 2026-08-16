import { z } from "zod";

export const createNoteSchema = z.object({
  contactId: z.number().min(1, "Выберите контакт"),
  content: z
    .string()
    .trim()
    .min(1, "Текст заметки обязателен для заполнения")
    .max(2000, "Заметка не должна превышать 2000 символов"),
});

export const updateNoteSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Текст заметки обязателен для заполнения")
    .max(2000, "Заметка не должна превышать 2000 символов"),
});

export type CreateNoteFormData = z.infer<typeof createNoteSchema>;
export type UpdateNoteFormData = z.infer<typeof updateNoteSchema>;
