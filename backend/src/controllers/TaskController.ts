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
  ) {
    return await this.taskService.findAll(listId, statusId);
  }
  @Get("/by-user")
  async findByUser(
    @CurrentUser() user: UserProps,
    @QueryParam("statusId") statusId?: number,
  ) {
    return await this.taskService.findByUser(user, statusId);
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
      data.statusId,
      data,
      user,
    );
  }

  @Put("/:id")
  async update(
    @Param("id") id: number,
    @Body({ validate: true }) data: UpdateTaskDto,
  ) {
    return await this.taskService.update(id, data);
  }

  @Delete("/:id")
  async delete(@Param("id") id: number, @CurrentUser() user: UserProps) {
    return await this.taskService.delete(id, user);
  }
}
