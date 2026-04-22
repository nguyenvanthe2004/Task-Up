export interface CreateListInput {
  name: string;
  description: string;
  icon?: string;
  color?: string;
  isPublic?: boolean;
}

export interface UpdateListInput {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  isPublic?: boolean;
}

export interface List {
  id: number;
  name: string;
  description: string;
  icon: string;
  color?: string;
  isPublic: boolean;
}
