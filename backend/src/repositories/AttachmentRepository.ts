import { Service } from "typedi";
import { Attachment, User } from "../models";
import { CreateAttachmentInput } from "../types/attachment";

@Service()
export class AttachmentRepository {
  async findByTaskId(taskId: number) {
    return await Attachment.findAll({
      where: { taskId },
      include: [{ model: User, as: "uploader", attributes: ["id", "fullName", "email", "avatar"] }],
      order: [["createdAt", "ASC"]],
    });
  }

  async findById(id: number) {
    return await Attachment.findOne({ where: { id } });
  }

  async create(uploadedBy: number, data: CreateAttachmentInput) {
    return await Attachment.create({ ...data, uploadedBy });
  }

  async delete(id: number) {
    return await Attachment.destroy({ where: { id } });
  }
}
