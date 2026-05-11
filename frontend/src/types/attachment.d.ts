import { User } from "./auth";

export interface Attachment {
  id: number;
  taskId: number;
  fileUrl: string;
  fileName: string;
  type: string;
  uploadedBy: number;
  uploader?: User;
  createdAt: string;
}
