export interface CreateActivityInput {
  action: string;
  taskId: number;
}

export interface UpdateActivityInput {
  action: string;
}

export interface Activity {
  id: number;
  action: string;
  taskId: number;
  userId: number;
}
