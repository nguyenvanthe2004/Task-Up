export interface CreateCommentInput {
  content: string;
  taskId: number;
}

export interface UpdateCommentInput {
  content: string;
}

export interface Comment {
  id: number;
  content: string;
  taskId: number;
  userId: number;
}
