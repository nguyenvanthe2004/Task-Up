import { Inject, Service } from "typedi";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { UserProps } from "../types/auth";
import { WorkspaceRepository } from "../repositories/WorkspaceRepository";
import { SpaceRepository } from "../repositories/SpaceRepository";
import { ListRepository } from "../repositories/ListRepository";
import { CreateListInput, UpdateListInput } from "../types/list";

@Service()
export class ListService {
  constructor(
    @Inject(() => ListRepository)
    private readonly listRepo: ListRepository,
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

  async countBySpace(categoryId: number) {
    return await this.listRepo.countBySpace(categoryId);
  }

  async findAll(categoryId?: number) {
    const lists = await this.listRepo.findAll(categoryId);
    const plainLists = lists.map((list) => list.get({ plain: true }));
    return plainLists;
  }

  async findById(id: number) {
    const list = await this.listRepo.findById(id);
    if (!list) {
      throw new NotFoundError("List not found");
    }

    const plainList = list.get({ plain: true });
    return plainList;
  }

  async create(categoryId: number, data: CreateListInput, user: UserProps) {
    const category = await this.categoryRepo.findById(categoryId);
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

    return await this.listRepo.create(categoryId, data);
  }

  async update(id: number, data: UpdateListInput, user: UserProps) {
    const list = await this.listRepo.findById(id);
    if (!list) {
      throw new BadRequestError("List not found");
    }
    const category = await this.categoryRepo.findById(list.categoryId);
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
    return await this.listRepo.update(id, data);
  }

  async delete(id: number, user: UserProps) {
    const list = await this.listRepo.findById(id);
    if (!list) {
      throw new BadRequestError("List not found");
    }
    const category = await this.categoryRepo.findById(list.categoryId);
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
    return await this.listRepo.delete(id);
  }
}
