import { Service, Inject } from "typedi";
import { SpaceRepository } from "../repositories/SpaceRepository";
import { WorkspaceRepository } from "../repositories/WorkspaceRepository";
import { CreateSpaceInput, UpdateSpaceInput } from "../types/space";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "routing-controllers";
import { UserProps } from "../types/auth";

@Service()
export class SpaceService {
  constructor(
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

  async findAll(workspaceId: number) {
    const spaces = await this.spaceRepo.findAll(workspaceId);
    const plainSpaces = spaces.map((space) => space.get({ plain: true }));
    return plainSpaces;
  }

  async findById(id: number) {
    const space = await this.spaceRepo.findById(id);

    if (!space) {
      throw new NotFoundError("Space not found");
    }

    const plainSpace = space.get({ plain: true });

    return plainSpace;
  }

  async create(workspaceId: number, data: CreateSpaceInput, user: UserProps) {
    const workspace = await this.workspaceRepo.findOne(workspaceId);

    if (!workspace) {
      throw new NotFoundError("Workspace not found");
    }

    const isMember = await this.workspaceRepo.checkUserInWorkspace(
      workspaceId,
      user.id,
    );

    if (!isMember) {
      throw new BadRequestError("You are not in this workspace");
    }

    const isOwner = await this.assertIsOwner(workspaceId, user.id);
    if (!isOwner) {
      throw new BadRequestError("Only the workspace owner can create spaces");
    }

    return await this.spaceRepo.create(workspaceId, data);
  }

  async update(
    id: number,
    data: UpdateSpaceInput,
    user: UserProps,
  ) {
    const space = await this.spaceRepo.findById(id);

    if (!space) {
      throw new NotFoundError("Space not found");
    }

    const isMember = await this.workspaceRepo.checkUserInWorkspace(
      space.workspaceId,
      user.id,
    );

    if (!isMember) {
      throw new BadRequestError("You are not allowed to update this space");
    }
    const isOwner = await this.assertIsOwner(space.workspaceId, user.id);
    if (!isOwner) {
      throw new BadRequestError("Only the workspace owner can create spaces");
    }

    return await this.spaceRepo.update(id, data);
  }

  async delete(id: number, user: UserProps) {
    const space = await this.spaceRepo.findById(id);

    if (!space) {
      throw new NotFoundError("Space not found");
    }

    const isMember = await this.workspaceRepo.checkUserInWorkspace(
      space.workspaceId,
      user.id,
    );

    if (!isMember) {
      throw new BadRequestError("You are not allowed to delete this space");
    }

    const isOwner = await this.assertIsOwner(space.workspaceId, user.id);
    if (!isOwner) {
      throw new BadRequestError("Only the workspace owner can create spaces");
    }

    await this.spaceRepo.delete(id);

    return { message: "Deleted successfully" };
  }

  async getMembers(spaceId: number, user: UserProps) {
    const space = await this.spaceRepo.findById(spaceId);

    if (!space) {
      throw new NotFoundError("Space not found");
    }

    const isMember = await this.workspaceRepo.checkUserInWorkspace(
      space.workspaceId,
      user.id,
    );

    if (!isMember) {
      throw new BadRequestError("You are not in this workspace");
    }

    const result = await this.spaceRepo.findMembers(spaceId);
    if (!result) throw new BadRequestError("Members not found");
    const plainResult = result.get({ plain: true });

    return plainResult;
  }

  async addMembers(spaceId: number, users: number[], user: UserProps) {
    const space = await this.spaceRepo.findById(spaceId);

    if (!space) {
      throw new NotFoundError("Space not found");
    }

    const isMember = await this.workspaceRepo.checkUserInWorkspace(
      space.workspaceId,
      user.id,
    );

    if (!isMember) {
      throw new BadRequestError("You are not in this workspace");
    }

    const isOwner = await this.assertIsOwner(space.workspaceId, user.id);
    if (!isOwner) {
      throw new BadRequestError("Only the workspace owner can create spaces");
    }

    const checks = await Promise.all(
      users.map((uid) =>
        this.workspaceRepo.checkUserInWorkspace(space.workspaceId, uid),
      ),
    );

    const invalidIds = users.filter((_, i) => !checks[i]);

    if (invalidIds.length > 0) {
      throw new BadRequestError(
        `Users [${invalidIds.join(", ")}] are not members of this workspace`,
      );
    }

    await this.spaceRepo.addMembers(spaceId, users);

    return { message: "Members added successfully" };
  }

  async removeMember(spaceId: number, targetUserId: number, user: UserProps) {
    const space = await this.spaceRepo.findById(spaceId);

    if (!space) {
      throw new NotFoundError("Space not found");
    }

    const isMember = await this.workspaceRepo.checkUserInWorkspace(
      space.workspaceId,
      user.id,
    );

    if (!isMember) {
      throw new BadRequestError("You are not in this workspace");
    }

    const isOwner = await this.assertIsOwner(space.workspaceId, user.id);
    if (!isOwner) {
      throw new BadRequestError("Only the workspace owner can create spaces");
    }

    if (targetUserId === user.id) {
      throw new BadRequestError("You cannot remove yourself");
    }

    const isInSpace = await this.spaceRepo.checkUserInSpace(
      spaceId,
      targetUserId,
    );

    if (!isInSpace) {
      throw new NotFoundError("Member not found in space");
    }

    await this.spaceRepo.removeMember(spaceId, targetUserId);

    return { message: "Member removed successfully" };
  }

  async countSpaces(workspaceId: number) {
    return await this.spaceRepo.countByWorkspace(workspaceId);
  }
}
