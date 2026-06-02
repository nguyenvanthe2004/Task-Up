import { Inject, Service } from "typedi";
import { NotFoundError } from "routing-controllers";
import { UserProps } from "../types/auth";
import { NotificationRepository } from "../repositories/NotificationRepository";
import { TaskRepository } from "../repositories/TaskRepository";
import { SocketService } from "./SocketService";
import {
  CreateNotificationInput,
  NotificationType,
} from "../types/notification";
import { ListRepository } from "../repositories/ListRepository";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { SpaceRepository } from "../repositories/SpaceRepository";
import { WorkspaceRepository } from "../repositories/WorkspaceRepository";

@Service()
export class NotificationService {
  constructor(
    @Inject(() => NotificationRepository)
    private readonly notificationRepo: NotificationRepository,

    @Inject(() => TaskRepository)
    private readonly taskRepo: TaskRepository,

    @Inject(() => ListRepository)
    private readonly listRepo: ListRepository,

    @Inject(() => CategoryRepository)
    private readonly categoryRepo: CategoryRepository,

    @Inject(() => SpaceRepository)
    private readonly spaceRepo: SpaceRepository,

    @Inject(() => WorkspaceRepository)
    private readonly workspaceRepo: WorkspaceRepository,

    @Inject(() => SocketService)
    private readonly socketService: SocketService,
  ) {}

  async findAll(user: UserProps, isRead?: boolean) {
    const notifications = await this.notificationRepo.findAll(user.id);
    return notifications.map((n) => n.get({ plain: true }));
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
    const plain = notification.get({ plain: true });
    this.socketService.emitToUser(user.id, "notification:updated", plain);
    return plain;
  }

  async markAllAsRead(user: UserProps) {
    await this.notificationRepo.markAllAsRead(user.id);
    this.socketService.emitToUser(user.id, "notification:all-read", {
      success: true,
    });
    return { success: true };
  }

  async findLatest(user: UserProps, workspaceId: number, isRead?: boolean) {
    const notifications = await this.notificationRepo.findLatest(
      user.id,
      workspaceId,
      isRead,
    );
    return notifications.map((n) => n.get({ plain: true }));
  }

  async create(userId: number, data: CreateNotificationInput) {
    const notification = await this.notificationRepo.create(userId, data);
    const plain = notification.get({ plain: true });
    this.socketService.emitNotification(userId, plain);
    return notification;
  }

  private async getOwnerIdFromTask(
    taskId: number,
  ): Promise<number | undefined> {
    try {
      const task = await this.taskRepo.findById(taskId);
      if (!task) return undefined;
      const list = await this.listRepo.findById(task.listId);
      const category = list
        ? await this.categoryRepo.findById(list.categoryId)
        : null;
      const space = category
        ? await this.spaceRepo.findById(category.spaceId)
        : null;
      const workspace = space
        ? await this.workspaceRepo.findOne(space.workspaceId)
        : null;
      return workspace?.dataValues?.ownerId;
    } catch {
      return undefined;
    }
  }

  async notifyTaskAssignees(
    taskId: number,
    user: UserProps,
    data: Omit<CreateNotificationInput, "taskId">,
  ) {
    const task = await this.taskRepo.findById(taskId);
    if (!task) throw new NotFoundError("Task not found");

    const ownerId = await this.getOwnerIdFromTask(taskId);

    const assigneeIds: number[] =
      task.assignees
        ?.filter((a: any) => a.id !== user.id)
        .map((a: any) => a.id) ?? [];

    const recipients = Array.from(
      new Set([...assigneeIds, ...(ownerId ? [ownerId] : [])]),
    );

    if (recipients.length === 0) return [];

    const created = await Promise.all(
      recipients.map((recipientId: number) =>
        this.notificationRepo.create(recipientId, { taskId, ...data }),
      ),
    );

    created.forEach((notification) => {
      const plain = notification.get({ plain: true });
      this.socketService.emitNotification(plain.userId, plain);
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
