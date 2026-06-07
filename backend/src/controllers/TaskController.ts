import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  QueryParam,
  CurrentUser,
} from "routing-controllers";
import { Inject, Service } from "typedi";
import { TaskService } from "../services/TaskService";
import { UserProps } from "../types/auth";
import { CreateTaskDto, UpdateTaskDto } from "../dtos/TaskDto";

@Service()
@JsonController("/tasks")
export class TaskController {
  constructor(
    @Inject(() => TaskService)
    private readonly taskService: TaskService,
  ) {}

  @Get()
  async findAll(
    @QueryParam("listId") listId?: number,
    @QueryParam("statusId") statusId?: number,
    @QueryParam("spaceId") spaceId?: number,
  ) {
    return await this.taskService.findAll(listId, statusId, spaceId);
  }
  @Get("/by-user")
  async findByUser(
    @CurrentUser() user: UserProps,
    @QueryParam("workspaceId") workspaceId?: number,
    @QueryParam("statusId") statusId?: number,
  ) {
    return await this.taskService.findByUser(user, workspaceId, statusId);
  }

  @Get("/summary")
  async getSummary(@CurrentUser() user: UserProps) {
    return await this.taskService.getSummary(user);
  }

  @Get("/search")
  async searchTasks(
    @CurrentUser() user: UserProps,
    @QueryParam("q", { required: true }) q: string,
    @QueryParam("workspaceId") workspaceId?: number,
    @QueryParam("listId") listId?: number,
    @QueryParam("statusId") statusId?: number,
  ) {
    return this.taskService.search(q, user, workspaceId, listId, statusId);
  }

  @Get("/:id")
  async findById(@Param("id") id: number) {
    return await this.taskService.findById(id);
  }

  @Post("/")
  async create(
    @Body({ validate: true }) data: CreateTaskDto,
    @CurrentUser() user: UserProps,
  ) {
    return await this.taskService.create(
      data.listId,
      data.statusId!,
      data,
      user,
    );
  }

  @Put("/:id")
  async update(
    @Param("id") id: number,
    @Body({ validate: true }) data: UpdateTaskDto,
    @CurrentUser() user: UserProps,
  ) {
    return await this.taskService.update(id, data, user);
  }

  @Delete("/:id")
  async delete(@Param("id") id: number, @CurrentUser() user: UserProps) {
    return await this.taskService.delete(id, user);
  }
}
