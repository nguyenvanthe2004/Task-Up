import { z } from "zod";

export const CreateSpaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Space name is required")
    .max(255, "Space name is too long"),

  description: z.string().trim().max(1000, "Description is too long"),

  icon: z.string().trim().max(255, "Icon is too long").optional(),

  color: z.string().trim().max(255, "Color is too long").optional(),
});

export type CreateSpaceFormData = z.infer<typeof CreateSpaceSchema>;

export const UpdateSpaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Space name is required")
    .max(255, "Space name is too long")
    .optional(),

  description: z
    .string()
    .trim()
    .max(1000, "Description is too long")
    .optional(),

  icon: z.string().trim().max(255, "Icon is too long").optional(),
  
  color: z.string().trim().max(255, "Color is too long").optional(),
});

export type UpdateSpaceFormData = z.infer<typeof UpdateSpaceSchema>;
