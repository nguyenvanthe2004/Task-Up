import { Service } from "typedi";
import {
  Task,
  User,
  TaskAssignee,
  Status,
  List,
  Category,
  Space,
} from "../models";
import { CreateTask, UpdateTask } from "../types/task";
import { toDate } from "../utils/helper";
import { literal, Op } from "sequelize";

@Service()
export class TaskRepository {
  async findById(id: number) {
    return await Task.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "assignees",
          attributes: ["id", "fullName", "email", "avatar"],
        },
      ],
    });
  }

  async findAll(listId?: number, statusId?: number) {
    const whereClause = {
      ...(listId !== undefined && { listId }),
      ...(statusId !== undefined && { statusId }),
    };
    return await Task.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "assignees",
          attributes: ["id", "fullName", "email", "avatar"],
        },
      ],
    });
  }

  async findByUser(userId: number, statusId?: number) {
    return await Task.findAll({
      where: {
        ...(statusId !== undefined ? { statusId } : {}),
        id: {
          [Op.in]: literal(
            `(SELECT taskId FROM task_assignees WHERE userId = ${userId})`,
          ),
        },
      },
      include: [
        {
          model: User,
          as: "assignees",
          attributes: ["id", "fullName", "email", "avatar"],
          through: { attributes: [] },
          required: false,
        },
        {
          model: Status,
          as: "status",
          attributes: ["id", "name", "color"],
        },
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
      order: [["createdAt", "DESC"]],
    });
  }

  async create(listId: number, statusId: number, data: CreateTask) {
    const { assignees, startDate, dueDate, ...taskData } = data;

    const task = await Task.create({
      ...taskData,
      startDate: toDate(startDate),
      dueDate: toDate(dueDate),
      listId,
      statusId,
    });

    if (assignees && assignees.length > 0) {
      await TaskAssignee.bulkCreate(
        assignees.map((userId: number) => ({ taskId: task.id, userId })),
      );
    }

    return task;
  }

  async update(id: number, data: UpdateTask) {
    const { assignees, startDate, dueDate, ...taskData } = data;

    await Task.update(
      {
        ...taskData,
        startDate: toDate(startDate),
        dueDate: toDate(dueDate),
      },
      { where: { id } },
    );

    if (assignees !== undefined) {
      await TaskAssignee.destroy({ where: { taskId: id } });

      if (assignees.length > 0) {
        await TaskAssignee.bulkCreate(
          assignees.map((userId: number) => ({ taskId: id, userId })),
        );
      }
    }

    return await Task.findByPk(id);
  }

  async delete(id: number) {
    await TaskAssignee.destroy({ where: { taskId: id } });
    return await Task.destroy({ where: { id } });
  }

  async countBySpace(listId: number) {
    return await Task.count({ where: { listId } });
  }
}
