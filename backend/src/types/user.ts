import { UserRole } from "../models/User";
import { Workspace } from "./workspace";

export interface CreateUserInput {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  avatar: string;
  verifyCode: string;
  isActive: boolean;
}
export interface UpdateProfileInput {
  fullName: string;
  phone: string;
}
export interface UpdatePasswordInput {
  oldPassword: string;
  newPassword: string;
}

export interface IUser {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  workspaces: Workspace[];
}
