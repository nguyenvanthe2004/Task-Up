import { Inject, Service } from "typedi";
import { NotFoundError } from "routing-controllers";
import { UserProps } from "../types/auth";
import { NotificationRepository } from "../repositories/NotificationRepository";
import { TaskRepository } from "../repositories/TaskRepository";
import { SocketService } from "./SocketService";
import { CreateNotificationInput, NotificationType } from "../types/notification";

@Service()
export class NotificationService {
  constructor(
    @Inject(() => NotificationRepository)
    private readonly notificationRepo: NotificationRepository,

    @Inject(() => TaskRepository)
    private readonly taskRepo: TaskRepository,

    @Inject(() => SocketService)
    private readonly socketService: SocketService,
  ) {}

  async findAll(user: UserProps, isRead?: boolean) {
    const notifications = await this.notificationRepo.findAll(user.id, isRead);
    return notifications.map((notification) => notification.get({ plain: true }));
  }

  async getUnreadCount(user: UserProps) {
    return await this.notificationRepo.countUnread(user.id);
  }

  async findById(id: number, user: UserProps) {
    const notification = await this.notificationRepo.findById(id, user.id);
    if (!notification) throw new NotFoundError("Notification not found");
    return notification.get({ plain: true });
  }

  async markAsRead(id: number, user: UserProps) {
    const notification = await this.notificationRepo.markAsRead(id, user.id);
    if (!notification) throw new NotFoundError("Notification not found");
    const plainNotification = notification.get({ plain: true });
    this.socketService.emitToUser(user.id, "notification:updated", plainNotification);
    return plainNotification;
  }

  async markAllAsRead(user: UserProps) {
    await this.notificationRepo.markAllAsRead(user.id);
    this.socketService.emitToUser(user.id, "notification:all-read", { success: true });
    return { success: true };
  }

  async create(userId: number, data: CreateNotificationInput) {
    const notification = await this.notificationRepo.create(userId, data);
    const plainNotification = notification.get({ plain: true });
    this.socketService.emitNotification(userId, plainNotification);
    return notification;
  }

  async notifyTaskAssignees(
    taskId: number,
    user: UserProps,
    data: Omit<CreateNotificationInput, "taskId">,
  ) {
    const task = await this.taskRepo.findById(taskId);
    if (!task) throw new NotFoundError("Task not found");

    const recipients = task.assignees?
      .filter((assignee: any) => assignee.id !== user.id)
      .map((assignee: any) => assignee.id) ?? [];

    if (recipients.length === 0) {
      return [];
    }

    const created = await Promise.all(
      recipients.map((recipientId) =>
        this.notificationRepo.create(recipientId, {
          taskId,
          ...data,
        }),
      ),
    );

    created.forEach((notification) => {
      const plainNotification = notification.get({ plain: true });
      this.socketService.emitNotification(plainNotification.userId, plainNotification);
    });

    return created;
  }

  async notifyTaskAssigneesWithReference(
    taskId: number,
    user: UserProps,
    type: NotificationType,
    title: string,
    message: string,
    referenceId?: number,
  ) {
    return await this.notifyTaskAssignees(taskId, user, {
      type,
      title,
      message,
      referenceId,
    });
  }
}
