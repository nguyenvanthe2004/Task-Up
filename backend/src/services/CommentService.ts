import { Inject, Service } from "typedi";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { UserProps } from "../types/auth";
import { CommentRepository } from "../repositories/CommentRepository";
import { TaskRepository } from "../repositories/TaskRepository";
import { CreateCommentInput, UpdateCommentInput } from "../types/comment";
import { ActivityService } from "./ActivityService";
import { NotificationService } from "./NotificationService";
import { SocketService } from "./SocketService";

@Service()
export class CommentService {
  constructor(
    @Inject(() => CommentRepository)
    private readonly commentRepo: CommentRepository,
    @Inject(() => TaskRepository)
    private readonly taskRepo: TaskRepository,
    @Inject(() => ActivityService)
    private readonly activityService: ActivityService,
    @Inject(() => NotificationService)
    private readonly notificationService: NotificationService,
    @Inject(() => SocketService)
    private readonly socketService: SocketService,
  ) {}

  async findAll(taskId?: number) {
    const comments = await this.commentRepo.findAll(taskId);
    return comments.map((c) => c.get({ plain: true }));
  }

  async findById(id: number) {
    const comment = await this.commentRepo.findById(id);
    if (!comment) {
      throw new NotFoundError("Comment not found");
    }
    return comment.get({ plain: true });
  }

  async create(data: CreateCommentInput, user: UserProps) {
    const task = await this.taskRepo.findById(data.taskId);
    if (!task) throw new NotFoundError("Task not found");

    const comment = await this.commentRepo.create(user.id, data);
    await this.activityService.logCommentAdded(data.taskId, user);
    await this.notificationService.notifyTaskAssigneesWithReference(
      data.taskId,
      user,
      "comment",
      "New comment",
      `${user.fullName} added a comment to task`,
      comment.id,
    );

    const recipients = task.assignees?.map((assignee: any) => assignee.id) ?? [];
    if (recipients.length > 0) {
      this.socketService.emitCommentCreated(recipients, comment.get({ plain: true }));
    }

    return comment;
  }

  async update(id: number, data: UpdateCommentInput, user: UserProps) {
    const comment = await this.commentRepo.findById(id);
    if (!comment) throw new NotFoundError("Comment not found");

    if (comment.userId !== user.id)
      throw new BadRequestError("You can only edit your own comments");

    const updatedComment = await this.commentRepo.update(id, user.id, data);
    const task = await this.taskRepo.findById(comment.taskId);
    const recipients = task?.assignees?.map((assignee: any) => assignee.id) ?? [];

    if (recipients.length > 0) {
      this.socketService.emitCommentUpdated(recipients, updatedComment.get({ plain: true }));
    }

    return updatedComment;
  }

  async delete(id: number, user: UserProps) {
    const comment = await this.commentRepo.findById(id);
    if (!comment) throw new NotFoundError("Comment not found");

    if (comment.userId !== user.id)
      throw new BadRequestError("You can only delete your own comments");

    const task = await this.taskRepo.findById(comment.taskId);
    await this.commentRepo.delete(id);
    await this.activityService.logCommentDeleted(comment.taskId, user);
    await this.notificationService.notifyTaskAssigneesWithReference(
      comment.taskId,
      user,
      "comment",
      "Comment removed",
      `${user.fullName} deleted a comment on task`,
      comment.id,
    );

    const recipients = task?.assignees?.map((assignee: any) => assignee.id) ?? [];
    if (recipients.length > 0) {
      this.socketService.emitCommentDeleted(recipients, {
        id: comment.id,
        taskId: comment.taskId,
        deletedBy: user.id,
      });
    }

    return { success: true };
  }
}
