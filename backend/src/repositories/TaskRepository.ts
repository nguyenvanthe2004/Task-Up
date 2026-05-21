import { Service } from "typedi";
import {
  Task,
  User,
  TaskAssignee,
  Status,
  List,
  Category,
  Space,
  Workspace,
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
                  include: [
                    {
                      model: Workspace,
                      as: "workspace",
                      attributes: ["id", "name", "ownerId"],
                    },
                  ],
                },
              ],
            },
          ],
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
                  include: [
                    {
                      model: Workspace,
                      as: "workspace",
                      attributes: ["id", "name", "ownerId"],
                    },
                  ],
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
    const { assignees, startDate, dueDate, isPublic, ...taskData } = data;

    const task = await Task.create({
      ...taskData,
      startDate: toDate(startDate),
      dueDate: toDate(dueDate),
      isPublic: isPublic ?? false,
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
    const { assignees, startDate, dueDate, isPublic, ...taskData } = data;

    await Task.update(
      {
        ...taskData,
        startDate: toDate(startDate),
        dueDate: toDate(dueDate),
        ...(isPublic !== undefined && { isPublic }),
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

  async findSummaryByUser(userId: number) {
    const now = new Date();
    const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    const userTaskIds = literal(
      `(SELECT taskId FROM task_assignees WHERE userId = ${userId})`,
    );

    const completedIds = literal(
      `(SELECT t.id FROM tasks t INNER JOIN statuses s ON t.statusId = s.id WHERE (LOWER(s.name) LIKE '%done%' OR LOWER(s.name) LIKE '%complete%' OR LOWER(s.name) LIKE '%closed%') AND t.id IN (SELECT taskId FROM task_assignees WHERE userId = ${userId}))`,
    );

    const [total, completed, upcoming, highPriority, dueToday] =
      await Promise.all([
        Task.count({ where: { id: { [Op.in]: userTaskIds } } }),
        Task.count({ where: { id: { [Op.in]: completedIds } } }),
        Task.count({
          where: {
            id: { [Op.in]: userTaskIds },
            dueDate: { [Op.between]: [now, in48h] },
          },
        }),
        Task.count({
          where: {
            id: { [Op.in]: userTaskIds },
            priority: { [Op.in]: ["high", "urgent"] },
          },
        }),
        Task.count({
          where: {
            id: { [Op.in]: userTaskIds },
            dueDate: { [Op.between]: [todayStart, todayEnd] },
          },
        }),
      ]);

    return { total, completed, upcoming, highPriority, dueToday };
  }
}
