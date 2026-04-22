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
} from "routing-controllers";
import { Service } from "typedi";
import { UserProps } from "../types/auth";
import { ListService } from "../services/ListService";
import { CreateListDto, UpdateListDto } from "../dtos/ListDto";

@Service()
@JsonController("/lists")
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get("/")
  async findAll(@QueryParam("categoryId") categoryId?: number) {
    return await this.listService.findAll(categoryId);
  }

  @Get("/:id")
  async findById(@Param("id") id: number) {
    return await this.listService.findById(id);
  }

  @Get("/count/:categoryId")
  async count(@Param("categoryId") categoryId: number) {
    return await this.listService.countBySpace(categoryId);
  }

  @Post("/")
  async create(
    @Body({ validate: true }) data: CreateListDto,
    @CurrentUser() user: UserProps,
  ) {
    return await this.listService.create(data.categoryId, data, user);
  }

  @Put("/:id")
  async update(
    @Param("id") id: number,
    @Body({ validate: true }) data: UpdateListDto,
    @CurrentUser() user: UserProps,
  ) {
    return await this.listService.update(id, data, user);
  }

  @Delete("/:id")
  async delete(@Param("id") id: number, @CurrentUser() user: UserProps) {
    return await this.listService.delete(id, user);
  }
}
