import { Inject, Service } from "typedi";
import { StatusRepository } from "../repositories/StatusRepository";
import { SpaceRepository } from "../repositories/SpaceRepository";
import { WorkspaceRepository } from "../repositories/WorkspaceRepository";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { CreateStatus, UpdateStatus } from "../types/status";
import { UserProps } from "../types/auth";

@Service()
export class StatusService {
  constructor(
    @Inject(() => StatusRepository)
    private readonly statusRepo: StatusRepository,

    @Inject(() => SpaceRepository)
    private readonly spaceRepo: SpaceRepository,

    @Inject(() => WorkspaceRepository)
    private readonly workspaceRepo: WorkspaceRepository,
  ) {}

  private async assertIsOwner(
    workspaceId: number,
    userId: number,
  ): Promise<boolean> {
    const workspace = await this.workspaceRepo.findOne(workspaceId);
    if (!workspace) throw new NotFoundError("Workspace not found");

    return workspace.ownerId === userId;
  }

  async findAll() {
    const statuses = await this.statusRepo.findAll();
    return statuses.map((s) => s.get({ plain: true }));
  }

  async findById(id: number) {
    const status = await this.statusRepo.findById(id);
    if (!status) throw new NotFoundError("Status not found");

    return status.get({ plain: true });
  }

  async create(spaceId: number, data: CreateStatus, user: UserProps) {
    const space = await this.spaceRepo.findById(spaceId);
    if (!space) throw new NotFoundError("Space not found");

    const isOwner = await this.assertIsOwner(space.workspaceId, user.id);
    if (!isOwner) {
      throw new BadRequestError("Only workspace owner can create status");
    }

    const existed = await this.statusRepo.findAll();
    if (existed.some((s) => s.name === data.name)) {
      throw new BadRequestError("Status name already exists");
    }

    return await this.statusRepo.create(data);
  }

  async update(id: number, data: UpdateStatus) {
    const status = await this.statusRepo.findById(id);
    if (!status) throw new NotFoundError("Status not found");

    return await this.statusRepo.update(id, data);
  }

  async delete(id: number, user: UserProps) {
    const status = await this.statusRepo.findById(id);
    if (!status) throw new NotFoundError("Status not found");

    return await this.statusRepo.delete(id);
  }

  async count() {
    return await this.statusRepo.count();
  }
}
