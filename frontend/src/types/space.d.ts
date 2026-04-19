import { UserWorkspace } from "./workspace";

export interface CreateSpace {
  name: string;
  description: string;
  icon?: string;
  color?: string;
}

export interface UpdateSpace {
  name: string;
  description: string;
  icon?: string;
  color?: string;
}
export interface SpaceMember {
  id: number;
  fullName: string;
  email: string;
  avatar: string;
}

export interface Space {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  createdAt: Date;
  workspaceId: {
    id: number;
    name: string;
  };
  members?: SpaceMember[];
  workspace?: {
    id: number;
    name: string;
    ownerId: number;
    userWorkspaces: UserWorkspace[];
  };
}
