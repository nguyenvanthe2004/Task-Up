import { Service } from "typedi";
import { Attachment, Category, List, Space, Task, User } from "../models";
import { CreateAttachmentInput } from "../types/attachment";

@Service()
export class AttachmentRepository {
  async findByTaskId(taskId?: number) {
    const whereClause = taskId !== undefined ? { taskId } : {};
    return await Attachment.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "uploader",
          attributes: ["id", "fullName", "email", "avatar"],
        },
        {
          model: Task,
          as: "task",
          attributes: ["id", "name"],
          include: [
            {
              model: List,
              as: "list",
              attributes: ["id", "name"],
              include: [
                {
                  model: Category,
                  as: "category",
                  attributes: ["id", "name"],
                  include: [
                    {
                      model: Space,
                      as: "space",
                      attributes: ["id", "name"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
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
