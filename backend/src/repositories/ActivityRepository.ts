import { Service } from "typedi";
import { Category, List, Space, Task, User } from "../models";
import Activity from "../models/Activity";
import { CreateActivityInput, UpdateActivityInput } from "../types/activityLog";

@Service()
export class ActivityRepository {
  async findAll(taskId?: number) {
    const whereClause = taskId !== undefined ? { taskId } : {};
    return await Activity.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
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

  async findRecent(userId: number, limit = 5) {
    return await Activity.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "avatar"],
        },
        {
          model: Task,
          as: "task",
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
    });
  }

  async findById(id: number) {
    return await Activity.findOne({
      where: { id },
    });
  }

  async create(userId: number, data: CreateActivityInput) {
    return await Activity.create({ ...data, userId });
  }

  async update(id: number, userId: number, data: UpdateActivityInput) {
    await Activity.update({ ...data, userId }, { where: { id } });
    return await this.findById(id);
  }

  async delete(id: number) {
    return await Activity.destroy({ where: { id } });
  }
}
