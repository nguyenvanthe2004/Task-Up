import { UserRole } from "../models/User";
export interface JwtPayload {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
}

export type UserProps = Omit<JwtPayload, "id"> & {
  id: number;
};