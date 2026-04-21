import { Inject, Service } from "typedi";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { CreateCategoryInput, UpdateCategoryInput } from "../types/category";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { UserProps } from "../types/auth";
import { WorkspaceRepository } from "../repositories/WorkspaceRepository";
import { SpaceRepository } from "../repositories/SpaceRepository";

@Service()
export class CategoryService {
  constructor(
    @Inject(() => CategoryRepository)
    private readonly categoryRepo: CategoryRepository,
    @Inject(() => WorkspaceRepository)
    private readonly workspaceRepo: WorkspaceRepository,
    @Inject(() => SpaceRepository)
    private readonly spaceRepo: SpaceRepository,
  ) {}

  private async assertIsOwner(
    workspaceId: number,
    userId: number,
  ): Promise<boolean> {
    const workspace = await this.workspaceRepo.findOne(workspaceId);
    if (!workspace) throw new NotFoundError("Workspace not found");

    return workspace.ownerId === userId;
  }

  async countBySpace(spaceId: number) {
    return await this.categoryRepo.countBySpace(spaceId);
  }

  async findAll(spaceId?: number) {
    const categories = await this.categoryRepo.findAll(spaceId);
    const plainCategories = categories.map((category) =>
      category.get({ plain: true }),
    );
    return plainCategories;
  }

  async findById(id: number) {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new NotFoundError("Category not found");
    }
    return category;
  }

  async create(spaceId: number, data: CreateCategoryInput, user: UserProps) {
    const space = await this.spaceRepo.findById(spaceId);

    if (!space) {
      throw new NotFoundError("Space not found");
    }

    const isOwner = await this.assertIsOwner(space.workspaceId, user.id);
    if (!isOwner) {
      throw new BadRequestError("Only the workspace owner can create spaces");
    }

    return await this.categoryRepo.create(spaceId, data);
  }

  async update(id: number, data: UpdateCategoryInput, user: UserProps) {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new BadRequestError("Category not found");
    }

    const space = await this.spaceRepo.findById(category.spaceId);

    if (!space) {
      throw new NotFoundError("Space not found");
    }

    const isOwner = await this.assertIsOwner(space.workspaceId, user.id);
    if (!isOwner) {
      throw new BadRequestError("Only the workspace owner can create spaces");
    }
    return await this.categoryRepo.update(id, data);
  }

  async delete(id: number, user: UserProps) {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new BadRequestError("Category not found");
    }

    const space = await this.spaceRepo.findById(category.spaceId);

    if (!space) {
      throw new NotFoundError("Space not found");
    }

    const isOwner = await this.assertIsOwner(space.workspaceId, user.id);
    if (!isOwner) {
      throw new BadRequestError("Only the workspace owner can create spaces");
    }
    return await this.categoryRepo.delete(id);
  }
}
