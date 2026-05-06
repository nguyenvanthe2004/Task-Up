import { Inject, Service } from "typedi";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { UserProps } from "../types/auth";
import { CommentRepository } from "../repositories/CommentRepository";
import { TaskRepository } from "../repositories/TaskRepository";
import { CreateCommentInput, UpdateCommentInput } from "../types/comment";

@Service()
export class CommentService {
  constructor(
    @Inject(() => CommentRepository)
    private readonly commentRepo: CommentRepository,
    @Inject(() => TaskRepository)
    private readonly taskRepo: TaskRepository,
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

    return await this.commentRepo.create(user.id, data);
  }

  async update(id: number, data: UpdateCommentInput, user: UserProps) {
    const comment = await this.commentRepo.findById(id);
    if (!comment) throw new NotFoundError("Comment not found");

    if (comment.userId !== user.id)
      throw new BadRequestError("You can only edit your own comments");

    return await this.commentRepo.update(id, user.id, data);
  }

  async delete(id: number, user: UserProps) {
    const comment = await this.commentRepo.findById(id);
    if (!comment) throw new NotFoundError("Comment not found");

    if (comment.userId !== user.id)
      throw new BadRequestError("You can only delete your own comments");

    return await this.commentRepo.delete(id);
  }
}
