import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParam } from "routing-controllers";
import { Inject, Service } from "typedi";
import { UserProps } from "../types/auth";
import { ActivityService } from "../services/ActivityService";
import { CreateActivityInput, UpdateActivityInput } from "../types/activityLog";

@Service()
@JsonController("/activities")
export class ActivityController {
  constructor(
    @Inject(() => ActivityService)
    private readonly activityService: ActivityService,
  ) {}

  @Get("/")
  async findAll(
    @QueryParam("taskId") taskId?: number,
    @QueryParam("spaceId") spaceId?: number,
  ) {
    return await this.activityService.findAll(taskId, spaceId);
  }

  @Get("/recent")
  async getRecent(@CurrentUser() user: UserProps) {
    return await this.activityService.getRecent(user);
  }

  @Get("/:id")
  async findById(@Param("id") id: number) {
    return await this.activityService.findById(id);
  }

  @Post("/")
  async create(
    @Body() data: CreateActivityInput,
    @CurrentUser() user: UserProps,
  ) {
    return await this.activityService.create(data, user);
  }

}