export interface CreateSpaceInput {
  name: string;
  description: string;
  icon?: string;
}

export interface UpdateSpaceInput {
  name: string;
  description: string;
  icon?: string;
}

export interface Space {
  id: number;
  name: string;
  description: string;
  icon: string;
}
