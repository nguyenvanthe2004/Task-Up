import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(255, "Category name is too long"),

  description: z.string().trim().min(1, "Description is required").max(1000, "Description is too long"),

  icon: z.string().trim().max(255, "Icon is too long").optional(),

  color: z.string().trim().max(255, "Color is too long").optional(),
});

export type CreateCategoryFormData = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(255, "Category name is too long")
    .optional(),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(1000, "Description is too long")
    .optional(),

  icon: z.string().trim().max(255, "Icon is too long").optional(),
  
  color: z.string().trim().max(255, "Color is too long").optional(),
});

export type UpdateCategoryFormData = z.infer<typeof UpdateCategorySchema>;
