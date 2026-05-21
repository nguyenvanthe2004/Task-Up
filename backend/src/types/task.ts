import { PriorityStatus } from "../models/Task";
import { Status } from "./status";

export interface CreateTask {
  name: string;
  description: string;
  priority?: PriorityStatus;
  tag?: string;
  startDate?: string;
  dueDate?: string;
  isPublic?: boolean;
  assignees?: number[];
}

export interface UpdateTask {
  name?: string;
  description?: string;
  priority?: PriorityStatus;
  tag?: string;
  startDate?: string;
  dueDate?: string;
  isPublic?: boolean;
  statusId?: number;
  assignees?: number[];
}

export interface Task {
  name: string;
  description: string;
  priority?: PriorityStatus;
  tag?: string;
  startDate?: string;
  dueDate?: string;
  isPublic?: boolean;
  status: Status[];
  assignees?: number[];
}
