export interface CreateWorkSpaceInput {
  name: string;
  description: string;
  icon?: string;
  color?: string;
}

export interface UpdateWorkSpaceInput {
  name: string;
  description: string;
  icon?: string;
  color?: string;
}

export interface Workspace {
  id: number;
  name: string;
  description: string;
  icon?: string;
  color?: string;
}
