import { Inject, Service } from "typedi";
import { TaskRepository } from "../repositories/TaskRepository";
import { ListRepository } from "../repositories/ListRepository";
import { WorkspaceRepository } from "../repositories/WorkspaceRepository";
import { SpaceRepository } from "../repositories/SpaceRepository";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { UserProps } from "../types/auth";
import { StatusRepository } from "../repositories/StatusRepository";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { CreateTask, UpdateTask } from "../types/task";

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
  ) {}

  private async assertIsOwner(
    workspaceId: number,
    userId: number,
  ): Promise<boolean> {
    const workspace = await this.workspaceRepo.findOne(workspaceId);
    if (!workspace) throw new NotFoundError("Workspace not found");

    return workspace.ownerId === userId;
  }

  async countByList(listId: number) {
    return await this.taskRepo.countBySpace(listId);
  }

  async findAll(listId?: number, statusId?: number) {
    const tasks = await this.taskRepo.findAll(listId, statusId);
    return tasks.map((task) => task.get({ plain: true }));
  }
  async findByUser(user: UserProps, statusId?: number) {
    const tasksByUser = await this.taskRepo.findByUser(user.id, statusId);
    return tasksByUser.map((task) => task.get({ plain: true }));
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
    if (!isOwner) {
      throw new BadRequestError("Only workspace owner can create task");
    }

    return await this.taskRepo.create(listId, statusId, data);
  }

  async update(id: number, data: UpdateTask) {
    return await this.taskRepo.update(id, data);
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
      throw new BadRequestError("Only workspace owner can delete task");
    }

    return await this.taskRepo.delete(id);
  }
}
