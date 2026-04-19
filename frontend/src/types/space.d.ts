import { UserWorkspace } from "./workspace";

export interface CreateSpace {
  name: string;
  description: string;
  icon?: string;
  isPublic?: boolean;
}

export interface UpdateSpace {
  name: string;
  description: string;
  icon?: string;
  isPublic?: boolean;
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
