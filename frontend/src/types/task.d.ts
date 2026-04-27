import { PriorityStatus } from "../constants";
import { Status } from "./status";

export type View = "list" | "kanban" | "calendar";

export interface ListViewHandle {
  refresh: () => void;
  getTasks: () => Task[];
}

export interface DetailTaskProps {
  task: Task;
  statuses?: Status[];
  onClose: () => void;
  onUpdate?: (data: UpdateTask) => void;
  onDelete?: () => void;
}

interface Member {
  id: number;
  fullName: string;
  email: string;
  avatar?: string;
}
export interface CreateTask {
  name: string;
  description: string;
  priority?: PriorityStatus;
  tag?: string;
  startDate?: string;
  dueDate?: string;
  statusId?: number; 
  listId?: number;
  assignees?: number[];
}

export interface UpdateTask {
  name?: string;
  description?: string;
  priority?: PriorityStatus;
  tag?: string;
  startDate?: string;
  dueDate?: string;
  statusId?: number;
  assignees?: number[];
}

export interface Task {
  id: number;
  name: string;
  description?: string;
  priority?: string;
  statusId: number;
  dueDate?: string;
  startDate?: string;
  tag?: string;
  listId?: number;
  assignees?: AvatarMember[];
  status: Status[];
  list: {
    id: number;
    name: string;
    category: {
      id: number;
      name: string;
      space: {
        id: number;
        name: string;
      };
    };
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ImportTask {
  name: string;
  description?: string;
  priority?: string;
  statusId?: number;
  dueDate?: string;
  startDate?: string;
  tag?: string;
  listId?: number;
  assignees?: AvatarMember[];
  list?: {
    name: string;
    category?: {
      name: string;
      space?: {
        name: string;
      };
    };
  };
}