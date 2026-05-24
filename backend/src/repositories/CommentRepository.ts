import { Service } from "typedi";
import { Comment, User } from "../models";
import { CreateCommentInput, UpdateCommentInput } from "../types/comment";

@Service()
export class CommentRepository {
  async findAll(taskId?: number) {
    const whereClause = taskId !== undefined ? { taskId } : {};
    return await Comment.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email", "avatar"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });
  }

  async findById(id: number) {
    return await Comment.findOne({
      where: { id },
    });
  }

  async create(userId: number, data: CreateCommentInput) {
  return await Comment.create({ ...data, userId });
}

  async update(id: number, userId: number, data: UpdateCommentInput) {
    await Comment.update({ ...data, userId }, { where: { id } });
    return await this.findById(id);
  }

  async delete(id: number) {
    return await Comment.destroy({ where: { id } });
  }
}
