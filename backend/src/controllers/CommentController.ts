import {
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  QueryParam,
  UseBefore,
} from "routing-controllers";
import { Service } from "typedi";
import { CommentService } from "../services/CommentService";
import { UserProps } from "../types/auth";
import { CreateCommentDto, UpdateCommentDto } from "../dtos/CommentDto";

@Service()
@JsonController("/comments")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get("/")
  async findAll(@QueryParam("taskId") taskId?: number) {
    return await this.commentService.findAll(taskId);
  }

  @Get("/:id")
  async findById(@Param("id") id: number) {
    return await this.commentService.findById(id);
  }

  @Post("/")
  async create(
    @Body() data: CreateCommentDto,
    @CurrentUser() user: UserProps,
  ) {
    return await this.commentService.create(data, user);
  }

  @Put("/:id")
  async update(
    @Param("id") id: number,
    @Body() data: UpdateCommentDto,
    @CurrentUser() user: UserProps,
  ) {
    return await this.commentService.update(id, data, user);
  }

  @Delete("/:id")
  async delete(@Param("id") id: number, @CurrentUser() user: UserProps) {
    return await this.commentService.delete(id, user);
  }
}