import { Service } from "typedi";
import { Category, List, Space, Task, User, Workspace } from "../models";
import Notification, { NotificationType } from "../models/Notification";
import { CreateNotificationInput } from "../types/notification";

@Service()
export class NotificationRepository {
  async findAll(userId: number, isRead?: boolean) {
    return await Notification.findAll({
      where: {
        userId,
        ...(isRead !== undefined ? { isRead } : {}),
      },
      include: [
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
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async findById(id: number, userId: number) {
    return await Notification.findOne({
      where: { id, userId },
      include: [
        {
          model: Task,
          as: "task",
          attributes: ["id", "name"],
        },
      ],
    });
  }

  async findLatest(userId: number, workspaceId: number, isRead?: boolean) {
    return await Notification.findAll({
      where: {
        userId,
        ...(isRead !== undefined ? { isRead } : {}),
      },
      include: [
        {
          model: Task,
          as: "task",
          include: [
            {
              model: List,
              as: "list",
              include: [
                {
                  model: Category,
                  as: "category",
                  include: [
                    {
                      model: Space,
                      as: "space",
                      where: {
                        workspaceId,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 5,
    });
  }

  async countUnread(userId: number) {
    return await Notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  async create(userId: number, data: CreateNotificationInput) {
    return await Notification.create({
      ...data,
      userId,
      type: data.type as NotificationType,
    });
  }
  async markAsRead(id: number, userId: number) {
    await Notification.update({ isRead: true }, { where: { id, userId } });
    return await this.findById(id, userId);
  }

  async markAllAsRead(userId: number) {
    return await Notification.update(
      { isRead: true },
      { where: { userId, isRead: false } },
    );
  }
}
