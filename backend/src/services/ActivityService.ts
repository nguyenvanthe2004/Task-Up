import { Inject, Service } from "typedi";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { UserProps } from "../types/auth";
import { TaskRepository } from "../repositories/TaskRepository";
import { ActivityRepository } from "../repositories/ActivityRepository";
import { CreateActivityInput, UpdateActivityInput } from "../types/activityLog";

@Service()
export class ActivityService {
  constructor(
    @Inject(() => ActivityRepository)
    private readonly activityRepo: ActivityRepository,
    @Inject(() => TaskRepository)
    private readonly taskRepo: TaskRepository,
  ) {}

  async findAll(taskId?: number) {
    const activities = await this.activityRepo.findAll(taskId);
    return activities.map((c) => c.get({ plain: true }));
  }

  async findById(id: number) {
    const activity = await this.activityRepo.findById(id);
    if (!activity) {
      throw new NotFoundError("activity not found");
    }
    return activity.get({ plain: true });
  }

  async create(data: CreateActivityInput, user: UserProps) {
    const task = await this.taskRepo.findById(data.taskId);
    if (!task) throw new NotFoundError("Task not found");

    return await this.activityRepo.create(user.id, data);
  }

  async logStatusChange(
    taskId: number,
    user: UserProps,
    newStatusName: string,
  ) {
    return await this.activityRepo.create(user.id, {
      taskId,
      action: `${user.fullName} changed status to ${newStatusName}`,
    });
  }

}
