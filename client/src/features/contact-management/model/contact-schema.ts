import { z } from "zod";

const phoneRegex = /^(\+?[0-9\s\-()]{7,20})$/;

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Имя обязательно для заполнения")
    .max(100, "Имя не должно превышать 100 символов"),
  email: z
    .string()
    .trim()
    .min(1, "Email обязателен для заполнения")
    .email("Введите корректный адрес электронной почты (например, user@example.com)"),
  phone: z
    .string()
    .trim()
    .min(1, "Номер телефона обязателен для заполнения")
    .regex(phoneRegex, "Некорректный формат телефона (например, +7 999 123-45-67)"),
  company: z
    .string()
    .trim()
    .max(100, "Название компании не должно превышать 100 символов")
    .optional()
    .or(z.literal("")),
  jobPosition: z
    .string()
    .trim()
    .max(100, "Должность не должна превышать 100 символов")
    .optional()
    .or(z.literal("")),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
