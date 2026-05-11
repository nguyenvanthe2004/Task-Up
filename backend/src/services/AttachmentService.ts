import { Inject, Service } from "typedi";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { Request } from "express";
import { UserProps } from "../types/auth";
import { AttachmentRepository } from "../repositories/AttachmentRepository";
import { TaskRepository } from "../repositories/TaskRepository";
import { UploadService } from "./UploadService";
import { ActivityService } from "./ActivityService";

@Service()
export class AttachmentService {
  constructor(
    @Inject(() => AttachmentRepository)
    private readonly attachmentRepo: AttachmentRepository,
    @Inject(() => TaskRepository)
    private readonly taskRepo: TaskRepository,
    @Inject(() => UploadService)
    private readonly uploadService: UploadService,
    @Inject(() => ActivityService)
    private readonly activityService: ActivityService,
  ) {}

  async findByTaskId(taskId: number) {
    const attachments = await this.attachmentRepo.findByTaskId(taskId);
    return attachments.map((a) => a.get({ plain: true }));
  }

  async upload(taskId: number, req: Request, user: UserProps) {
    const task = await this.taskRepo.findById(taskId);
    if (!task) throw new NotFoundError("Task not found");

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) throw new BadRequestError("No file uploaded");

    const results = await Promise.all(
      files.map(async (file) => {
        const uploaded = await this.uploadService.uploadFile(file);
        const attachment = await this.attachmentRepo.create(user.id, {
          taskId,
          fileUrl: uploaded.url,
          fileName: uploaded.name,
          type: file.mimetype,
        });
        await this.activityService.logAttachmentAdded(taskId, user, uploaded.name);
        return attachment;
      }),
    );

    return results;
  }

  async delete(id: number, user: UserProps) {
    const attachment = await this.attachmentRepo.findById(id);
    if (!attachment) throw new NotFoundError("Attachment not found");

    if (attachment.uploadedBy !== user.id)
      throw new BadRequestError("You can only delete your own attachments");

    await this.activityService.logAttachmentRemoved(attachment.taskId, user, attachment.fileName);

    return await this.attachmentRepo.delete(id);
  }
}
