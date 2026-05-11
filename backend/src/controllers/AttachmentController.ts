import {
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  QueryParam,
  Req,
  UseBefore,
} from "routing-controllers";
import { Service } from "typedi";
import { Request } from "express";
import { AttachmentService } from "../services/AttachmentService";
import { UploadMiddleware } from "../middlewares/uploadMiddleware";
import { UserProps } from "../types/auth";

@Service()
@JsonController("/attachments")
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Get("/")
  async findByTaskId(@QueryParam("taskId") taskId: number) {
    return await this.attachmentService.findByTaskId(taskId);
  }

  @Post("/upload/:taskId")
  @UseBefore(UploadMiddleware)
  async upload(
    @Param("taskId") taskId: number,
    @Req() req: Request,
    @CurrentUser() user: UserProps,
  ) {
    return await this.attachmentService.upload(taskId, req, user);
  }

  @Delete("/:id")
  async delete(@Param("id") id: number, @CurrentUser() user: UserProps) {
    return await this.attachmentService.delete(id, user);
  }
}
