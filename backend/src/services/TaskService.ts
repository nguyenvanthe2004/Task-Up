import { Inject, Service } from "typedi";
import Task from "../models/Task";
import { TaskRepository } from "../repositories/TaskRepository";
import { ListRepository } from "../repositories/ListRepository";
import { WorkspaceRepository } from "../repositories/WorkspaceRepository";
import { SpaceRepository } from "../repositories/SpaceRepository";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { UserProps } from "../types/auth";
import { StatusRepository } from "../repositories/StatusRepository";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { CreateTask, UpdateTask } from "../types/task";
import { ActivityService } from "./ActivityService";
import { NotificationService } from "./NotificationService";
import { SocketService } from "./SocketService";
import { UserRepository } from "../repositories/UserRepository";

@Service()
export class TaskService {
  constructor(
    @Inject(() => TaskRepository)
    private readonly taskRepo: TaskRepository,

    @Inject(() => ListRepository)
    private readonly listRepo: ListRepository,

    @Inject(() => StatusRepository)
    private readonly statusRepo: StatusRepository,

    @Inject(() => WorkspaceRepository)
    private readonly workspaceRepo: WorkspaceRepository,

    @Inject(() => SpaceRepository)
    private readonly spaceRepo: SpaceRepository,

    @Inject(() => CategoryRepository)
    private readonly categoryRepo: CategoryRepository,

    @Inject(() => ActivityService)
    private readonly activityService: ActivityService,

    @Inject(() => NotificationService)
    private readonly notificationService: NotificationService,

    @Inject(() => UserRepository)
    private readonly userRepo: UserRepository,

    @Inject(() => SocketService)
    private readonly socketService: SocketService,
  ) {}

  private async assertIsOwner(
    workspaceId: number,
    userId: number,
  ): Promise<boolean> {
    const workspace = await this.workspaceRepo.findOne(workspaceId);
    if (!workspace) throw new NotFoundError("Workspace not found");

    return workspace.ownerId === userId;
  }

  private async assertIsMember(
    spaceId: number,
    userId: number,
  ): Promise<boolean> {
    const isMember = await this.spaceRepo.isMember(spaceId, userId);
    if (!isMember)
      throw new BadRequestError("You are not a member of this space");
    return true;
  }

  async countByList(listId: number) {
    return await this.taskRepo.countBySpace(listId);
  }

  async findAll(listId?: number, statusId?: number) {
    const tasks: Task[] = await this.taskRepo.findAll(listId, statusId);
    return tasks.map((task) => task.get({ plain: true }));
  }
  async findByUser(user: UserProps, statusId?: number) {
    const tasksByUser: Task[] = await this.taskRepo.findByUser(user.id, statusId);
    return tasksByUser.map((task) => task.get({ plain: true }));
  }

  async getSummary(user: UserProps) {
    return await this.taskRepo.findSummaryByUser(user.id);
  }

  async findById(id: number) {
    const task = await this.taskRepo.findById(id);
    if (!task) throw new NotFoundError("Task not found");

    return task.get({ plain: true });
  }

  async create(
    listId: number,
    statusId: number,
    data: CreateTask,
    user: UserProps,
  ) {
    const list = await this.listRepo.findById(listId);
    if (!list) throw new BadRequestError("List not found");

    const status = await this.statusRepo.findById(statusId);
    if (!status) throw new BadRequestError("Status not found");

    const category = await this.categoryRepo.findById(list.categoryId);
    if (!category) throw new NotFoundError("Category not found");

    const space = await this.spaceRepo.findById(category.spaceId);
    if (!space) throw new NotFoundError("Space not found");

    const isOwner = await this.assertIsOwner(space.workspaceId, user.id);
    if (!isOwner) await this.assertIsMember(space.id, user.id);

    const task = await this.taskRepo.create(listId, statusId, data);

    await this.activityService.logCreated(task.id, user, task.name);
    await this.notificationService.notifyTaskAssigneesWithReference(
      task.id,
      user,
      "task",
      "New task assigned",
      `${user.fullName} created task "${task.name}"`,
      task.id,
    );

    const assigneeIds = data.assignees ?? [];
    if (assigneeIds.length > 0) {
      this.socketService.emitTaskCreated(assigneeIds, {
        taskId: task.id,
        name: task.name,
        createdBy: user.id,
      });
    }

    return task;
  }

  async update(id: number, data: UpdateTask, user: UserProps) {
    const task = await this.taskRepo.findById(id);
    if (!task) throw new NotFoundError("Task not found");

    const list = await this.listRepo.findById(task.listId);
    if (!list) throw new BadRequestError("List not found");

    const category = await this.categoryRepo.findById(list.categoryId);
    if (!category) throw new NotFoundError("Category not found");

    const space = await this.spaceRepo.findById(category.spaceId);
    if (!space) throw new NotFoundError("Space not found");

    const isOwner = await this.assertIsOwner(space.workspaceId, user.id);

    if (!isOwner) {
      await this.assertIsMember(space.id, user.id);

      const isAssignee = task.assignees?.some((a: any) => a.id === user.id);
      if (!isAssignee) {
        throw new BadRequestError("You can only update tasks assigned to you");
      }
    }

    const oldStatusId = task.statusId;
    const oldName = task.name;
    const oldPriority = task.priority;
    const oldDueDate = task.dueDate
      ? new Date(task.dueDate).toDateString()
      : null;
    const newDueDate = data.dueDate
      ? new Date(data.dueDate).toDateString()
      : null;

    const oldAssigneeIds: number[] = task.assignees?.map((a: any) => a.id) ?? [];
    const newAssigneeIds: number[] = data.assignees ?? oldAssigneeIds;
    const addedAssigneeIds = data.assignees
      ? newAssigneeIds.filter((id: number) => oldAssigneeIds.indexOf(id) === -1)
      : [];
    const removedAssigneeIds = data.assignees
      ? oldAssigneeIds.filter((id: number) => newAssigneeIds.indexOf(id) === -1)
      : [];

    const updatedTask = await this.taskRepo.update(id, data);

    if (data.statusId !== undefined && data.statusId !== oldStatusId) {
      const newStatus = await this.statusRepo.findById(data.statusId);
      if (!newStatus) throw new BadRequestError("Status not found");
      await this.activityService.logStatusChange(id, user, newStatus.name);
    }

    if (data.name !== undefined && data.name !== oldName) {
      await this.activityService.logRenamed(id, user, oldName, data.name);
    }

    if (data.priority !== undefined && data.priority !== oldPriority) {
      await this.activityService.logPriorityChange(id, user, data.priority);
    }

    if (data.dueDate !== undefined && newDueDate !== oldDueDate) {
      await this.activityService.logDueDateChange(
        id,
        user,
        data.dueDate ?? null,
      );
    }

    const changeMessages: string[] = [];
    if (data.statusId !== undefined && data.statusId !== oldStatusId) {
      const newStatus = await this.statusRepo.findById(data.statusId);
      if (newStatus) {
        changeMessages.push(`Status changed to ${newStatus.name}`);
      }
    }

    if (data.name !== undefined && data.name !== oldName) {
      changeMessages.push(`Renamed from "${oldName}" to "${data.name}"`);
    }

    if (data.priority !== undefined && data.priority !== oldPriority) {
      changeMessages.push(`Priority changed to ${data.priority}`);
    }

    if (data.dueDate !== undefined && newDueDate !== oldDueDate) {
      changeMessages.push(`Due date updated to ${data.dueDate ?? "none"}`);
    }

    const affectedAssigneeIds = Array.from(new Set([...oldAssigneeIds, ...newAssigneeIds]));

    if (changeMessages.length > 0) {
      await this.notificationService.notifyTaskAssigneesWithReference(
        id,
        user,
        "task",
        "Task updated",
        `${user.fullName} updated task: ${changeMessages.join("; ")}`,
        id,
      );

      if (affectedAssigneeIds.length > 0) {
        this.socketService.emitTaskUpdated(affectedAssigneeIds, {
          taskId: id,
          changes: changeMessages,
          updatedBy: user.id,
        });
      }
    }

    if (addedAssigneeIds.length > 0 || removedAssigneeIds.length > 0) {
      const addedUsers = await Promise.all(
        addedAssigneeIds.map((assigneeId: number) => this.userRepo.findOne(assigneeId)),
      );
      const removedUsers = await Promise.all(
        removedAssigneeIds.map((assigneeId: number) => this.userRepo.findOne(assigneeId)),
      );

      for (const assignee of addedUsers.filter(Boolean)) {
        await this.activityService.logAssigneeAdded(id, user, assignee!.fullName);
      }

      for (const assignee of removedUsers.filter(Boolean)) {
        await this.activityService.logAssigneeRemoved(id, user, assignee!.fullName);
      }

      const assigneeChangePayload = {
        taskId: id,
        addedAssignees: addedAssigneeIds,
        removedAssignees: removedAssigneeIds,
        changedBy: user.id,
      };

      this.socketService.emitAssigneeChanged(affectedAssigneeIds, assigneeChangePayload);
    }

    return updatedTask;
  }

  async delete(id: number, user: UserProps) {
    const task = await this.taskRepo.findById(id);
    if (!task) throw new BadRequestError("Task not found");

    const list = await this.listRepo.findById(task.listId);
    if (!list) throw new BadRequestError("List not found");

    const category = await this.categoryRepo.findById(list.categoryId);
    if (!category) throw new NotFoundError("Category not found");

    const space = await this.spaceRepo.findById(category.spaceId);
    if (!space) throw new NotFoundError("Space not found");

    const isOwner = await this.assertIsOwner(space.workspaceId, user.id);

    if (!isOwner) {
      await this.assertIsMember(space.id, user.id);

      const isAssignee = task.assignees?.some((a: any) => a.id === user.id);
      if (!isAssignee) {
        throw new BadRequestError("You can only delete tasks assigned to you");
      }
    }

    await this.activityService.logDeleted(id, user, task.name);
    await this.notificationService.notifyTaskAssigneesWithReference(
      id,
      user,
      "task",
      "Task deleted",
      `${user.fullName} deleted task "${task.name}"`,
      id,
    );

    const assigneeIds = task.assignees?.map((assignee: any) => assignee.id) ?? [];
    if (assigneeIds.length > 0) {
      this.socketService.emitTaskDeleted(assigneeIds, {
        taskId: id,
        deletedBy: user.id,
        taskName: task.name,
      });
    }

    return await this.taskRepo.delete(id);
  }
}
