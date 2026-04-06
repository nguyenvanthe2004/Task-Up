import { UserRole } from "../models/User";

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
