import { CreateSpace, UpdateSpace } from "../types/space";
import instance from "./req";

export const callGetSpaces = async (workspaceId?: number) => {
  return await instance.get("/spaces", {
    params: workspaceId !== undefined ? { workspaceId } : {},
  });
};

export const callGetSpaceById = async (id: number) => {
  return await instance.get(`/spaces/${id}`);
};

export const callCountSpaces = async (workspaceId: number) => {
  return await instance.get(`/spaces/count/${workspaceId}`);
};

export const callGetSpaceMembers = async (spaceId: number) => {
  return await instance.get(`/spaces/${spaceId}/members`);
};

export const callAddSpaceMembers = async (spaceId: number, userIds: number[]) => {
  return await instance.post(`/spaces/${spaceId}/members`, { userIds });
};

export const callRemoveSpaceMember = async (spaceId: number, userId: number) => {
  return await instance.delete(`/spaces/${spaceId}/members/${userId}`);
};

export const callCreateSpace = async (data: CreateSpace, workspaceId: number) => {
  return await instance.post("/spaces", { ...data, workspaceId });
};

export const callUpdateSpace = async (
  id: number,
  data: UpdateSpace
) => {
  return await instance.put(`/spaces/${id}`, data);
};

export const callDeleteSpace = async (id: number) => {
  return await instance.delete(`/spaces/${id}`);
};