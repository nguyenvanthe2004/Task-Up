import { User } from "./auth";

export interface CreateComment {
  content: string;
  taskId: number;
}

export interface UpdateComment {
  content: string;
}

export interface Comment {
  id: number;
  content: string;
  taskId: number;
  userId: number;
  user: User;
  createdAt: Date;
}
