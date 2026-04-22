import { z } from "zod";

export const CreateListSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "CreateList name is required")
    .max(255, "CreateList name is too long"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(1000, "Description is too long"),

  icon: z.string().trim().max(255, "Icon is too long").optional(),

  color: z.string().trim().max(255, "Color is too long").optional(),

  isPublic: z.boolean().optional(),
});

export type CreateListFormData = z.infer<typeof CreateListSchema>;

export const UpdateListSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "CreateList name is required")
    .max(255, "CreateList name is too long")
    .optional(),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(1000, "Description is too long")
    .optional(),

  icon: z.string().trim().max(255, "Icon is too long").optional(),

  color: z.string().trim().max(255, "Color is too long").optional(),

  isPublic: z.boolean().optional(),
});

export type UpdateListFormData = z.infer<typeof UpdateListSchema>;
