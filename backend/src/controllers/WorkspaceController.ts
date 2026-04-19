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
  Authorized,
} from "routing-controllers";
import { Service } from "typedi";
import { CreateWorkSpaceInput, UpdateWorkSpaceInput } from "../types/workspace";
import { UserProps } from "../types/auth";
import { WorkspaceService } from "../services/WorkspaceService";

@Service()
@JsonController("/workspaces")
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get("/count/all")
  async countAll() {
    return await this.workspaceService.countAll();
  }

  @Get("/")
  async findAll(
    @QueryParam("page") page: number,
    @QueryParam("limit") limit: number,
  ) {
    return await this.workspaceService.findAll(page, limit);
  }

  @Get("/me")
  async findMyWorkspace(@CurrentUser() user: UserProps) {
    return await this.workspaceService.findByUser(user);
  }

  @Get("/owner")
  async findOwnerWorkspace(@CurrentUser() user: UserProps) {
    return await this.workspaceService.findByOwner(user);
  }

  @Get("/:id")
  async findById(@Param("id") id: number) {
    return await this.workspaceService.findById(id);
  }

  @Get("/:id/members")
  async getMembers(
    @Param("id") workspaceId: number,
    @CurrentUser() user: UserProps,
  ) {
    return await this.workspaceService.getMembers(workspaceId, user);
  }

  @Post("/")
  async create(
    @CurrentUser() user: UserProps,
    @Body() data: CreateWorkSpaceInput,
  ) {
    return await this.workspaceService.create(user, data);
  }

  @Post("/:id/invite")
  async inviteMember(
    @Param("id") workspaceId: number,
    @Body() body: { email: string },
    @CurrentUser() user: UserProps,
  ) {
    return await this.workspaceService.inviteMember(
      workspaceId,
      body.email,
      user,
    );
  }

  @Post("/accept-invite")
  async acceptInvite(
    @Body() body: { token: string },
    @CurrentUser() user: UserProps,
  ) {
    return await this.workspaceService.acceptInvite(body.token, user);
  }

  @Put("/:id")
  async update(
    @Param("id") id: number,
    @Body() data: UpdateWorkSpaceInput,
    @CurrentUser() user: UserProps,
  ) {
    return await this.workspaceService.update(id, data, user);
  }

  @Delete("/:id")
  async delete(@Param("id") id: number, @CurrentUser() user: UserProps) {
    return await this.workspaceService.delete(id, user);
  }

  @Delete("/:id/members/:userId")
  async removeMember(
    @Param("id") workspaceId: number,
    @Param("userId") targetUserId: number,
    @CurrentUser() user: UserProps,
  ) {
    return await this.workspaceService.removeMember(
      workspaceId,
      targetUserId,
      user,
    );
  }
}
