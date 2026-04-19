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
import { Service } from "typedi";
import { SpaceService } from "../services/SpaceService";
import { CreateSpaceDto, UpdateSpaceDto } from "../dtos/SpaceDto";
import { UserProps } from "../types/auth";

@Service()
@JsonController("/spaces")
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Get("/")
  async findAll(@QueryParam("workspaceId") workspaceId?: number) {
    return await this.spaceService.findAll(workspaceId!);
  }

  @Get("/:id")
  async findById(@Param("id") id: number) {
    return await this.spaceService.findById(id);
  }

  @Get("/count/:workspaceId")
  async countSpaces(@Param("workspaceId") workspaceId: number) {
    return await this.spaceService.countSpaces(workspaceId);
  }

  @Get("/:id/members")
  async getMembers(
    @Param("id") id: number,
    @CurrentUser() user: UserProps,
  ) {
    return await this.spaceService.getMembers(id, user);
  }

  @Post("/")
  async create(
    @Body({ validate: true }) data: CreateSpaceDto,
    @CurrentUser() user: UserProps,
  ) {
    return await this.spaceService.create(data.workspaceId, data, user);
  }

  @Post("/:id/members")
  async addMembers(
    @Param("id") id: number,
    @Body() body: { userIds: number[] },
    @CurrentUser() user: UserProps,
  ) {
    return await this.spaceService.addMembers(id, body.userIds, user);
  }

  @Put("/:id")
  async update(
    @Param("id") id: number,
    @Body({ validate: true }) data: UpdateSpaceDto,
    @CurrentUser() user: UserProps,
  ) {
    return await this.spaceService.update(id, data, user);
  }

  @Delete("/:id")
  async delete(@Param("id") id: number, @CurrentUser() user: UserProps) {
    return await this.spaceService.delete(id, user);
  }

  @Delete("/:id/members/:userId")
  async removeMember(
    @Param("id") id: number,
    @Param("userId") userId: number,
    @CurrentUser() user: UserProps,
  ) {
    return await this.spaceService.removeMember(id, userId, user);
  }
}