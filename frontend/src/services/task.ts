import { CreateTask, UpdateTask } from "../types/task";
import instance from "./req";

export const callGetTasks = async (listId?: number, statusId?: number) => {
  const params: Record<string, number | undefined> = {};
  if (listId !== undefined) params.listId = listId;
  if (statusId !== undefined) params.statusId = statusId;

  return await instance.get("/tasks", { params });
};

export const callGetTaskByUser = async (userId: number, statusId?: number) => {
  return await instance.get("/tasks/by-user", {
    params: {
      userId,
      ...(statusId !== undefined ? { statusId } : {}),
    },
  });
};
export const callGetTaskById = async (id: number) => {
  return await instance.get(`/tasks/${id}`);
};

export const callCreateTask = async (data: CreateTask) => {
  return await instance.post("/tasks", data);
};

export const callUpdateTask = async (id: number, data: UpdateTask) => {
  return await instance.put(`/tasks/${id}`, data);
};

export const callDeleteTask = async (id: number) => {
  return await instance.delete(`/tasks/${id}`);
};
