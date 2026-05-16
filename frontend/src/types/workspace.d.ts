import { User } from "./auth";

export interface Workspace {
  id: number;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  ownerId: {
    id: number;
  };
  users: User[];
}

export interface UserWorkspace {
  role: string;
  acceptedAt: Date;
  invitedBy: number;
  inviter?: {
    email: string;
    fullName: string;
  };
  userId: number;
  workspaces?: Workspace[];
}

export interface CreateWorkspace {
  name: string;
  description: string;
  icon?: string;
  color?: string;
}
export interface UpdateWorkspace {
  name: string;
  description: string;
  icon?: string;
  color?: string;
}
