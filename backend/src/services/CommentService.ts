import { Inject, Service } from "typedi";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { UserProps } from "../types/auth";
import { CommentRepository } from "../repositories/CommentRepository";
import { TaskRepository } from "../repositories/TaskRepository";
import { CreateCommentInput, UpdateCommentInput } from "../types/comment";
import { ActivityService } from "./ActivityService";
import { NotificationService } from "./NotificationService";
import { SocketService } from "./SocketService";
import { User } from "../models";

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
    if (!comment) throw new NotFoundError("Comment not found");
    return comment.get({ plain: true });
  }

  async create(data: CreateCommentInput, user: UserProps) {
  const task = await this.taskRepo.findById(data.taskId);
  if (!task) throw new NotFoundError("Task not found");

  const comment = await this.commentRepo.create(user.id, data);
  await this.activityService.logCommentAdded(data.taskId, user);
  await this.notificationService.notifyTaskAssigneesWithReference(
    data.taskId, user, "comment", "New comment",
    `${user.fullName} added a comment to task`, comment!.id,
  );

  const assigneeIds = task.assignees?.map((a: User) => a.id) ?? [];
  const recipients = Array.from(new Set([...assigneeIds, user.id]));

  const plain = comment!.get({ plain: true });
  const payload = {
    ...plain,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
    },
  };

  if (recipients.length > 0) {
    this.socketService.emitCommentCreated(recipients, payload);
  }

  return comment;
}

  async update(id: number, data: UpdateCommentInput, user: UserProps) {
  const comment = await this.commentRepo.findById(id);
  if (!comment) throw new NotFoundError("Comment not found");

  const task = await this.taskRepo.findById(comment.taskId);
  const ownerId = (task as any)?.list?.category?.space?.workspace?.ownerId;
  const isOwner = ownerId === user.id;

  if (comment.userId !== user.id && !isOwner)
    throw new BadRequestError("You can only edit your own comments");

  const updatedComment = await this.commentRepo.update(id, user.id, data);
  const assigneeIds = (task as any)?.assignees?.map((a: any) => a.id) ?? [];
  const recipients = Array.from(new Set([...assigneeIds, user.id]));

  if (recipients.length > 0) {
    this.socketService.emitCommentUpdated(recipients, updatedComment!.get({ plain: true }));
  }

  return updatedComment;
}

async delete(id: number, user: UserProps) {
  const comment = await this.commentRepo.findById(id);
  if (!comment) throw new NotFoundError("Comment not found");

  const task = await this.taskRepo.findById(comment.taskId);
  const ownerId = (task as any)?.list?.category?.space?.workspace?.ownerId;
  const isOwner = ownerId === user.id;

  if (comment.userId !== user.id && !isOwner)
    throw new BadRequestError("You can only delete your own comments");

  const taskId = comment.taskId;
  const commentId = comment.id;

  await this.commentRepo.delete(id);
  await this.activityService.logCommentDeleted(taskId, user);
  await this.notificationService.notifyTaskAssigneesWithReference(
    taskId, user, "comment", "Comment removed",
    `${user.fullName} deleted a comment on task`, commentId,
  );

  const assigneeIds = (task as any)?.assignees?.map((a: any) => a.id) ?? [];
  const recipients = Array.from(new Set([...assigneeIds, user.id]));
  if (recipients.length > 0) {
    this.socketService.emitCommentDeleted(recipients, { id: commentId, taskId, deletedBy: user.id });
  }

  return { success: true };
}
}
