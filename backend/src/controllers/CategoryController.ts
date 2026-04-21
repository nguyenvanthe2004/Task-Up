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
import { CategoryService } from "../services/CategoryService";
import { CreateCategoryDto, UpdateCategoryDto } from "../dtos/CategoryDto";
import { UserProps } from "../types/auth";

@Service()
@JsonController("/categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get("/")
  async findAll(@QueryParam("spaceId") spaceId?: number) {
    return await this.categoryService.findAll(spaceId);
  }

  @Get("/:id")
  async findById(@Param("id") id: number) {
    return await this.categoryService.findById(id);
  }

  @Get("/count/:spaceId")
  async count(@Param("spaceId") spaceId: number) {
    return await this.categoryService.countBySpace(spaceId);
  }

  @Post("/")
  async create(
    @Body({ validate: true }) data: CreateCategoryDto,
    @CurrentUser() user: UserProps,
  ) {
    return await this.categoryService.create(data.spaceId, data, user);
  }

  @Put("/:id")
  async update(
    @Param("id") id: number,
    @Body({ validate: true }) data: UpdateCategoryDto,
    @CurrentUser() user: UserProps,
  ) {
    return await this.categoryService.update(id, data, user);
  }

  @Delete("/:id")
  async delete(@Param("id") id: number, @CurrentUser() user: UserProps) {
    return await this.categoryService.delete(id, user);
  }
}
