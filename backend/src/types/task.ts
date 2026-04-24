import { PriorityStatus } from "../models/Task";
import { Status } from "./status";

export interface CreateTask {
  name: string;
  description: string;
  priority?: PriorityStatus;
  tag?: string;
  startDate?: string;
  dueDate?: string;
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
  name: string;
  description: string;
  priority?: PriorityStatus;
  tag?: string;
  startDate?: string;
  dueDate?: string;
  status: Status[];
  assignees?: number[];
}
