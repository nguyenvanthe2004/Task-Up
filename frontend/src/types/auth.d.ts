import { Workspace } from "./workspace";

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}
export interface LoginData {
  email: string;
  password: string;
}
export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  UserWorkspace: {
    role: string;
    acceptedAt: Date;
    invitedBy: number;
    inviter?: {
      email: string;
    };
    workspaces?: Workspace[];
  };
}

export interface CurrentUserState {
  currentUser: User;
}
