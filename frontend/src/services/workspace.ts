import { CreateWorkspace, UpdateWorkspace } from "../types/workspace";
import instance from "./req";

export const callCountWorkspace = async () => {
  return await instance.get("/workspaces/count/all");
};
export const callGetMembers = async (workspaceId: number) => {
  return await instance.get(`/workspaces/${workspaceId}/members`);
};

export const callGetWorkspaces = async (page = 1, limit = 10) => {
  return await instance.get("/workspaces", {
    params: { page, limit },
  });
};

export const callGetWorkspaceById = async (id: number) => {
  return await instance.get(`/workspaces/${id}`);
};
export const callGetWorkspaceByUser = async (id: number) => {
  return await instance.get(`/workspaces/${id}`);
};

export const callGetMyWorkspace = async () => {
  return await instance.get("/workspaces/me");
};
export const callGetMyWorkspaceByOwner = async () => {
  return await instance.get("/workspaces/owner");
};
export const callCreateWorkspace = async (data: CreateWorkspace) => {
  return await instance.post("/workspaces", data);
};
export const callInviteMember = async (workspaceId: number, email: string) => {
  return await instance.post(`/workspaces/${workspaceId}/invite`, {
    email,
  });
};

export const callAcceptInvite = async (token: string) => {
  return await instance.post("/workspaces/accept-invite", {
    token,
  });
};
export const callUpdateWorkspace = async (
  id: number,
  data: UpdateWorkspace,
) => {
  return await instance.put(`/workspaces/${id}`, data);
};

export const callDeleteWorkspace = async (id: number) => {
  return await instance.delete(`/workspaces/${id}`);
};
export const callRemoveMember = async (workspaceId: number, userId: number) => {
  return await instance.delete(`/workspaces/${workspaceId}/members/${userId}`);
};
