import { Inject, Service } from "typedi";
import { NotFoundError } from "routing-controllers";
import { UserProps } from "../types/auth";
import { TaskRepository } from "../repositories/TaskRepository";
import { ActivityRepository } from "../repositories/ActivityRepository";
import { CreateActivityInput } from "../types/activityLog";
import { SocketService } from "./SocketService";
import { NotificationService } from "./NotificationService";

@Service()
export class ActivityService {
  constructor(
    @Inject(() => ActivityRepository)
    private readonly activityRepo: ActivityRepository,
    @Inject(() => TaskRepository)
    private readonly taskRepo: TaskRepository,
    @Inject(() => SocketService)
    private readonly socketService: SocketService,
    @Inject(() => NotificationService)
    private readonly notificationService: NotificationService,
  ) {}

  async findAll(taskId?: number) {
    const activities = await this.activityRepo.findAll(taskId);
    return activities.map((c) => c.get({ plain: true }));
  }

  async getRecent(user: UserProps, limit = 5) {
    const activities = await this.activityRepo.findRecent(user.id, limit);
    return activities.map((a) => a.get({ plain: true }));
  }

  async findById(id: number) {
    const activity = await this.activityRepo.findById(id);
    if (!activity) throw new NotFoundError("Activity not found");
    return activity.get({ plain: true });
  }

  async create(data: CreateActivityInput, user: UserProps) {
    const task = await this.taskRepo.findById(data.taskId);
    if (!task) throw new NotFoundError("Task not found");

    const activity = await this.activityRepo.create(user.id, data);
    const plainActivity = activity.get({ plain: true });

    const recipients = task.assignees?.map((a: any) => a.id) ?? [];

    if (recipients.length > 0) {
      this.socketService.emitActivityCreated(recipients, plainActivity);
    }

    await this.notificationService.notifyTaskAssigneesWithReference(
      data.taskId,
      user,
      "task",
      "New activity",
      data.action,
      activity.id,
    );

    return activity;
  }
  private async log(taskId: number, userId: number, action: string) {
    const activity = await this.activityRepo.create(userId, { taskId, action });
    const task = await this.taskRepo.findById(taskId);

    if (task) {
      const assigneeIds = task.assignees?.map((a: any) => a.id) ?? [];

      const recipients = Array.from(new Set([...assigneeIds, userId]));

      if (recipients.length > 0) {
        this.socketService.emitActivityCreated(
          recipients,
          activity.get({ plain: true }),
        );
      }
    }

    return activity;
  }

  async logStatusChange(
    taskId: number,
    user: UserProps,
    newStatusName: string,
  ) {
    return await this.log(
      taskId,
      user.id,
      `${user.fullName} changed status to ${newStatusName}`,
    );
  }

  async logCreated(taskId: number, user: UserProps, taskName: string) {
    return await this.log(
      taskId,
      user.id,
      `${user.fullName} created task "${taskName}"`,
    );
  }

  async logDeleted(taskId: number, user: UserProps, taskName: string) {
    return await this.log(
      taskId,
      user.id,
      `${user.fullName} deleted task "${taskName}"`,
    );
  }

  async logRenamed(
    taskId: number,
    user: UserProps,
    oldName: string,
    newName: string,
  ) {
    return await this.log(
      taskId,
      user.id,
      `${user.fullName} renamed task from "${oldName}" to "${newName}"`,
    );
  }

  async logPriorityChange(taskId: number, user: UserProps, priority: string) {
    return await this.log(
      taskId,
      user.id,
      `${user.fullName} changed priority to ${priority}`,
    );
  }

  async logDueDateChange(
    taskId: number,
    user: UserProps,
    dueDate: string | null,
  ) {
    const value = dueDate
      ? new Date(dueDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "none";
    return await this.log(
      taskId,
      user.id,
      `${user.fullName} changed due date to ${value}`,
    );
  }

  async logAssigneeAdded(
    taskId: number,
    user: UserProps,
    assigneeName: string,
  ) {
    return await this.log(
      taskId,
      user.id,
      `${user.fullName} assigned ${assigneeName}`,
    );
  }

  async logAssigneeRemoved(
    taskId: number,
    user: UserProps,
    assigneeName: string,
  ) {
    return await this.log(
      taskId,
      user.id,
      `${user.fullName} removed ${assigneeName} from assignees`,
    );
  }

  async logAttachmentAdded(taskId: number, user: UserProps, fileName: string) {
    const activity = await this.log(
      taskId,
      user.id,
      `${user.fullName} added attachment "${fileName}"`,
    );
    await this.notificationService.notifyTaskAssigneesWithReference(
      taskId,
      user,
      "attachment",
      "Attachment added",
      `${user.fullName} added attachment "${fileName}"`,
      activity.id,
    );
    return activity;
  }

  async logAttachmentRemoved(
    taskId: number,
    user: UserProps,
    fileName: string,
  ) {
    const activity = await this.log(
      taskId,
      user.id,
      `${user.fullName} removed attachment "${fileName}"`,
    );
    await this.notificationService.notifyTaskAssigneesWithReference(
      taskId,
      user,
      "attachment",
      "Attachment removed",
      `${user.fullName} removed attachment "${fileName}"`,
      activity.id,
    );
    return activity;
  }

  async logCommentAdded(taskId: number, user: UserProps) {
    const activity = await this.log(
      taskId,
      user.id,
      `${user.fullName} added a comment`,
    );
    await this.notificationService.notifyTaskAssigneesWithReference(
      taskId,
      user,
      "comment",
      "New comment",
      `${user.fullName} added a comment`,
      activity.id,
    );
    return activity;
  }

  async logCommentDeleted(taskId: number, user: UserProps) {
    const activity = await this.log(
      taskId,
      user.id,
      `${user.fullName} deleted a comment`,
    );
    await this.notificationService.notifyTaskAssigneesWithReference(
      taskId,
      user,
      "comment",
      "Comment removed",
      `${user.fullName} deleted a comment`,
      activity.id,
    );
    return activity;
  }
}
