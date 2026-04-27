import { z } from "zod";
import { PriorityStatus } from "../constants";

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim();

export const CreateTaskSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Task name is required")
    .max(255, "Task name is too long"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(1000, "Description is too long")
    .refine(
      (val) => !val || stripHtml(val).length <= 1000,
      "Description is too long"
    ),

  priority: z.nativeEnum(PriorityStatus).optional(),

  tag: z.string().trim().max(255, "Tag is too long").optional(),

  startDate: z.string().optional(),
  dueDate: z.string().optional(),

  assignees: z.array(z.number().int("Assignee must be a number")).optional(),
});

export type CreateTaskFormData = z.infer<typeof CreateTaskSchema>;

export const UpdateTaskSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Task name is required")
    .max(255, "Task name is too long")
    .optional(),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(1000, "Description is too long")
    .refine(
      (val) => !val || stripHtml(val).length <= 1000,
      "Description is too long"
    )
    .optional(),

  priority: z.nativeEnum(PriorityStatus).optional(),

  tag: z.string().trim().max(255, "Tag is too long").optional(),

  startDate: z.string().optional(),
  dueDate: z.string().optional(),

  assignees: z.array(z.number().int("Assignee must be a number")).optional(),

  statusId: z.number().int("StatusId must be a number").optional()
});

export type UpdateTaskFormData = z.infer<typeof UpdateTaskSchema>;
