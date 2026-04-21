import { CreateCategory, UpdateCategory } from "../types/category";
import instance from "./req";

export const callGetCategories = async (spaceId?: number) => {
  return await instance.get("/categories", {
    params: spaceId !== undefined ? { spaceId } : {},
  });
};

export const callGetCategoryById = async (id: number) => {
    return await instance.get(`/categories/${id}`);
}

export const callCountCategories = async (spaceId: number) => {
  return await instance.get(`/categories/count/${spaceId}`);
}

export const callCreateCategory = async (data: CreateCategory, spaceId: number) => {
    return await instance.post("/categories", { ...data, spaceId });
}

export const callUpdateCategory = async (id: number, data: UpdateCategory) => {
    return await instance.put(`/categories/${id}`, data);
}

export const callDeleteCategory = async (id: number) => {
    return await instance.delete(`/categories/${id}`);
}
