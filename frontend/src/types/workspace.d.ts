export interface Workspace {
  id: number;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  ownerId: {
    id: number;
  };
}

export interface UserWorkspace {
  role: string;
  acceptedAt: Date;
  invitedBy: number;
  inviter?: {
    email: string;
  };
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
