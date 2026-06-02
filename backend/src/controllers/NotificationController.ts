import {
  CurrentUser,
  Get,
  JsonController,
  Param,
  Patch,
  QueryParam,
} from "routing-controllers";
import { Inject, Service } from "typedi";
import { UserProps } from "../types/auth";
import { NotificationService } from "../services/NotificationService";

@Service()
@JsonController("/notifications")
export class NotificationController {
  constructor(
    @Inject(() => NotificationService)
    private readonly notificationService: NotificationService,
  ) {}

  @Get("/")
  async findAll(
    @CurrentUser() user: UserProps,
    @QueryParam("isRead") isRead?: boolean,
  ) {
    return await this.notificationService.findAll(user, isRead);
  }

  @Get("/unread-count")
  async getUnreadCount(@CurrentUser() user: UserProps) {
    return await this.notificationService.getUnreadCount(user);
  }
  @Get("/latest")
  async findLatest(
    @CurrentUser() user: UserProps,
    @QueryParam("workspaceId") workspaceId: number,
    @QueryParam("isRead") isRead?: boolean,
  ) {
    return await this.notificationService.findLatest(user, workspaceId, isRead);
  }

  @Get(":id")
  async findById(@Param("id") id: number, @CurrentUser() user: UserProps) {
    return await this.notificationService.findById(id, user);
  }

  @Patch(":id/read")
  async markAsRead(@Param("id") id: number, @CurrentUser() user: UserProps) {
    return await this.notificationService.markAsRead(id, user);
  }

  @Patch("/mark-all-read")
  async markAllAsRead(@CurrentUser() user: UserProps) {
    return await this.notificationService.markAllAsRead(user);
  }
}
