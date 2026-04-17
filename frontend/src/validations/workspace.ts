import { z } from "zod";

export const CreateWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, "Workspace name is required")
    .max(255, "Workspace name is too long"),

  description: z
    .string()
    .max(1000, "Description is too long")
    .optional(),
});

export type CreateWorkspaceFormData = z.infer<typeof CreateWorkspaceSchema>;

export const UpdateWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Workspace name is required")
    .max(255, "Workspace name is too long")
    .optional(),

  description: z
    .string()
    .trim()
    .max(1000, "Description is too long")
    .optional(),
});

export type UpdateWorkspaceFormData = z.infer<typeof UpdateWorkspaceSchema>;