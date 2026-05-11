import instance from "./req";

export const callGetAttachments = async (taskId: number) => {
  return await instance.get("/attachments", { params: { taskId } });
};

export const callUploadAttachments = async (taskId: number, files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  return await instance.post(`/attachments/upload/${taskId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const callDeleteAttachment = async (id: number) => {
  return await instance.delete(`/attachments/${id}`);
};
