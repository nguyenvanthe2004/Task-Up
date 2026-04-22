import { CreateList, UpdateList } from "../types/list";
import instance from "./req";

export const callGetLists = async (categoryId?: number) => {
  return await instance.get("/lists", {
    params: categoryId !== undefined ? { categoryId } : {},
  });
};

export const callGetListById = async (id: number) => {
    return await instance.get(`/lists/${id}`);
}

export const callCountLists = async (categoryId: number) => {
  return await instance.get(`/lists/count/${categoryId}`);
}

export const callCreateList = async (data: CreateList, categoryId: number) => {
    return await instance.post("/lists", { ...data, categoryId });
}

export const callUpdateList = async (id: number, data: UpdateList) => {
    return await instance.put(`/lists/${id}`, data);
}

export const callDeleteList = async (id: number) => {
    return await instance.delete(`/lists/${id}`);
}
