export type NotificationType =
  | "task"
  | "comment"
  | "attachment"
  | "activity"
  | "system";

export interface CreateNotificationInput {
  taskId: number;
  type: NotificationType;
  title: string;
  message: string;
  referenceId?: number;
}

export interface Notification {
  id: number;
  userId: number;
  taskId: number;
  type: NotificationType;
  title: string;
  message: string;
  referenceId?: number;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
