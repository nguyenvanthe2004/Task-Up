import { UserRole } from "../models/User";

export interface JwtPayload {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
}

export type UserProps = Omit<JwtPayload, "userId"> & {
  userId: string;
};