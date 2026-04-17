import { Service, Inject } from "typedi";
import { WorkspaceRepository } from "../repositories/WorkspaceRepository";
import { CreateWorkSpaceInput, UpdateWorkSpaceInput } from "../types/workspace";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { UserProps } from "../types/auth";
import { MailService } from "./MailService";
import { generateInviteToken, verifyInviteToken } from "../utils/helper";
import { WorkspaceRole } from "../models/UserWorkspace";

@Service()
export class WorkspaceService {
  constructor(
    @Inject(() => WorkspaceRepository)
    private readonly workspaceRepo: WorkspaceRepository,
    private readonly mailService: MailService,
  ) {}

  async countAll() {
    return await this.workspaceRepo.countAll();
  }

  async findAll(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;

      const [workspaces, total] = await Promise.all([
        this.workspaceRepo.findAll(skip, limit),
        this.workspaceRepo.countAll(),
      ]);

      return {
        totalPages: Math.ceil(total / limit),
        data: workspaces,
      };
    } catch {
      throw new BadRequestError("Failed to fetch workspaces");
    }
  }

  async findById(id: number) {
    const workspace = await this.workspaceRepo.findOne(id);

    if (!workspace) {
      throw new NotFoundError("Workspace not found");
    }

    return workspace;
  }

  async findByOwner(user: UserProps) {
    const workspace = await this.workspaceRepo.findByOwnerId(user.id);

    if (!workspace) {
      throw new NotFoundError("Workspace not found for this owner");
    }

    return { data: workspace };
  }
  async findByUser(user: UserProps) {
    const workspace = await this.workspaceRepo.findByUser(user.id);

    if (!workspace) {
      throw new NotFoundError("Workspace not found for this user");
    }

    return workspace;
  }

  async getMembers(workspaceId: number, user: UserProps) {
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

    const members = await this.workspaceRepo.findMembers(workspaceId);
    const result = members!.get({ plain: true });

    return result;
  }

  async create(user: UserProps, data: CreateWorkSpaceInput) {
    if (!data.name) {
      throw new BadRequestError("Workspace name is required");
    }

    return await this.workspaceRepo.createWithMembers(user.id, data);
  }

  async inviteMember(workspaceId: number, email: string, user: UserProps) {
    const workspace = await this.workspaceRepo.findOne(workspaceId);

    if (!workspace) {
      throw new NotFoundError("Workspace not found");
    }

    if (workspace.ownerId !== user.id) {
      throw new BadRequestError("Only owner can invite members");
    }

    const inviteToken = generateInviteToken({
      workspaceId,
      email,
      invitedBy: user.id,
    });

    await this.mailService.sendInviteEmail(email, inviteToken);

    return { message: "Invite sent successfully" };
  }

  async acceptInvite(inviteToken: string, currentUser: UserProps) {
    const payload = verifyInviteToken(inviteToken);

    if (!payload) {
      throw new BadRequestError("Invalid or expired invite");
    }

    if (payload.email !== currentUser.email) {
      throw new BadRequestError("This invite is not for you");
    }

    await this.workspaceRepo.addMember(
      payload.workspaceId,
      currentUser.id,
      WorkspaceRole.MEMBER,
      payload.invitedBy,
    );

    return {
      message: "Joined workspace successfully",
      workspaceId: payload.workspaceId,
    };
  }

  async update(id: number, data: UpdateWorkSpaceInput, user: UserProps) {
    const workspace = await this.workspaceRepo.findOne(id);

    if (!workspace) {
      throw new NotFoundError("Workspace not found");
    }

    if (workspace.ownerId !== user.id) {
      throw new BadRequestError("You are not allowed to update this workspace");
    }

    return await this.workspaceRepo.update(id, data);
  }

  async delete(id: number, user: UserProps) {
    const workspace = await this.workspaceRepo.findOne(id);

    if (!workspace) {
      throw new NotFoundError("Workspace not found");
    }

    if (workspace.ownerId !== user.id) {
      throw new BadRequestError("You are not allowed to update this workspace");
    }

    await this.workspaceRepo.delete(id);

    return { message: "Deleted successfully" };
  }
  async removeMember(
    workspaceId: number,
    targetUserId: number,
    user: UserProps,
  ) {
    const workspace = await this.workspaceRepo.findOne(workspaceId);

    if (!workspace) {
      throw new NotFoundError("Workspace not found");
    }

    if (workspace.ownerId !== user.id) {
      throw new BadRequestError("Only owner can remove members");
    }

    if (targetUserId === user.id) {
      throw new BadRequestError("You cannot remove yourself");
    }

    const isMember = await this.workspaceRepo.checkUserInWorkspace(
      workspaceId,
      targetUserId,
    );

    if (!isMember) {
      throw new NotFoundError("Member not found in workspace");
    }

    await this.workspaceRepo.removeMember(workspaceId, targetUserId);

    return { message: "Member removed successfully" };
  }
}
