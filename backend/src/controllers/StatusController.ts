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
import { StatusService } from "../services/StatusService";
import { UserProps } from "../types/auth";
import { CreateStatusDto, UpdateStatusDto } from "../dtos/StatusDto";

@Service()
@JsonController("/statuses")
export class StatusController {
  constructor(
    @Inject(() => StatusService)
    private readonly statusService: StatusService,
  ) {}

  @Get()
  async findAll() {
    return await this.statusService.findAll();
  }

  @Get("/:id")
  async findById(@Param("id") id: number) {
    return await this.statusService.findById(id);
  }

  @Post("/")
  async create(
    @Body({ validate: true }) body: CreateStatusDto,
    @CurrentUser() user: UserProps,
  ) {
    return await this.statusService.create(body.spaceId, body, user);
  }

  @Put("/:id")
  async update(
    @Param("id") id: number,
    @Body({ validate: true }) body: UpdateStatusDto,
  ) {
    return await this.statusService.update(id, body);
  }

  @Delete("/:id")
  async delete(
    @Param("id") id: number,
    @CurrentUser() user: UserProps,
  ) {
    return await this.statusService.delete(id, user);
  }
}