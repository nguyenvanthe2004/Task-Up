import { CreateComment, UpdateComment } from "../types/comment";
import instance from "./req";

export const callGetComments = async (taskId?: number) => {
  return await instance.get("/comments", {
    params: taskId !== undefined ? { taskId } : {},
  });
};

export const callGetCommentById = async (id: number) => {
  return await instance.get(`/comments/${id}`);
};

export const callCreateComment = async (data: CreateComment) => {
  return await instance.post("/comments", data);
};

export const callUpdateComment = async (
  id: number,
  data: UpdateComment,
) => {
  return await instance.put(`/comments/${id}`, data);
};

export const callDeleteComment = async (id: number) => {
  return await instance.delete(`/comments/${id}`);
};