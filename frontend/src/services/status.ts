import { CreateStatus, UpdateStatus } from "../types/status";
import instance from "./req";

export const callGetStatuses = async () => {
  return await instance.get("/statuses");
};

export const callGetStatusById = async (id: number) => {
  return await instance.get(`/statuses/${id}`);
};

export const callCreateStatus = async (data: CreateStatus) => {
  return await instance.post("/statuses", data);
};

export const callUpdateStatus = async (id: number, data: UpdateStatus) => {
  return await instance.put(`/statuses/${id}`, data);
};

export const callDeleteStatus = async (id: number) => {
  return await instance.delete(`/statuses/${id}`);
};