export interface Notification {
  id: number;
  userId: number;
  taskId: number;
  type: string;
  title: string;
  message: string;
  referenceId?: number;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  task?: { id: number; name: string };
}

export type FilterTab = "All" | "Unread";