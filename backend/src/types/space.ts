export interface CreateSpaceInput {
  name: string;
  description: string;
  icon?: string;
  color?: string;
}

export interface UpdateSpaceInput {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface Space {
  id: number;
  name: string;
  description: string;
  icon: string;
  color?: string;
}
