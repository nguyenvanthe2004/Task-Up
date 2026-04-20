export interface CreateCategoryInput {
  name: string;
  description: string;
  icon?: string;
  color?: string;
}

export interface UpdateCategoryInput {
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
  color?: string;
}
