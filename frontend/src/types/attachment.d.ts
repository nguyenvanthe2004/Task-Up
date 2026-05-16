import { User } from "./auth";
import { Task } from "./task";

export interface Attachment {
  id: number;
  task: {
    name: string;
    list: {
      id: number;
      name: string;
      category: {
        id: number;
        name: string;
        space: {
          id: number;
          name: string;
        };
      };
    };
  };
  taskId: number;
  fileUrl: string;
  fileName: string;
  type: string;
  uploadedBy: number;
  uploader?: User;
  createdAt: string;
}
