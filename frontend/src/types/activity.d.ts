export interface Activity {
  id: number;
  action: string;
  taskId: number;
  userId: number;
  createdAt: Date;
}