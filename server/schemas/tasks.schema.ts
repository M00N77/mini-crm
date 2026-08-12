import { z } from "zod";

export const TASK_STATUS = ["pending", "in_progress", "done"] as const;

export type TaskStatus = (typeof TASK_STATUS)[number];

const taskFields = {
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().max(10000, "Description too long").optional(),
  status: z.enum(TASK_STATUS, { message: "Invalid status" }),
  position: z.number().int().optional(),
};

export const createTaskSchema = z.object(taskFields);

export const updateTaskSchema = z.object({
  ...taskFields,
  position: z.number().int(),
});

export const patchTaskSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(255, "Title too long")
      .optional(),
    description: z.string().max(10000, "Description too long").optional(),
    status: z.enum(TASK_STATUS, { message: "Invalid status" }).optional(),
    position: z.number().int().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
