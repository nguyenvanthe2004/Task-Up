import { z } from "zod";

export const CreateCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment is required")
    .max(255, "Comment is too long"),
  taskId: z.number(),

});

export type CreateCommentFormData = z.infer<typeof CreateCommentSchema>;

export const UpdateCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment is required")
    .max(255, "Comment is too long"),
});

export type UpdateCommentFormData = z.infer<typeof UpdateCommentSchema>;
