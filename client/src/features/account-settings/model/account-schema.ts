import { z } from "zod";

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, "Текущий пароль должен содержать минимум 6 символов"),
    newPassword: z
      .string()
      .min(6, "Новый пароль должен содержать минимум 6 символов")
      .max(50, "Пароль слишком длинный"),
    confirmPassword: z
      .string()
      .min(6, "Подтвердите новый пароль"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "Новый пароль должен отличаться от текущего",
    path: ["newPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
