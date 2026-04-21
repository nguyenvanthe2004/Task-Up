import { UserWorkspace } from "./workspace";

export interface CreateCategory {
  name: string;
  description: string;
  icon?: string;
  color?: string;
}

export interface UpdateCategory {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
}


export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  createdAt: Date;
}
