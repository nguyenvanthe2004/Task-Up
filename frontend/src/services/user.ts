import type { User } from "../types/auth";
import { UserRole } from "../constants";
import instance from "./req";

export interface UsersResponse {
  totalPages: number;
  data: AdminUser[];
}

export interface AdminUser extends User {
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const callGetUsers = async (page = 1, limit = 10) => {
  return await instance.get<UsersResponse>("/users", {
    params: { page, limit },
  });
};

export const callUpdateUserRole = async (userId: number, role: UserRole) => {
  return await instance.put<AdminUser>(`/users/${userId}/role`, { role });
};
