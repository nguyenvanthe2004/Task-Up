export interface CreateList {
  name: string;
  description: string;
  icon?: string;
  color?: string;
  isPublic?: boolean;
}

export interface UpdateList {
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
  color: string;
  isPublic: boolean;
  tasks: Task[];
  createdAt: Date;
}
