import { Service, Inject } from "typedi";
import { WorkspaceRepository } from "../repositories/WorkspaceRepository";
import { UserRepository } from "../repositories/UserRepository";
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

    @Inject(() => UserRepository)
    private readonly userRepo: UserRepository,

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
      throw new BadRequestError("Only the workspace owner can invite members");
    }

    // Prevent inviting yourself
    if (email.toLowerCase() === user.email.toLowerCase()) {
      throw new BadRequestError("You cannot invite yourself");
    }

    // Check if the email belongs to an existing user who is already a member
    const targetUser = await this.userRepo.findByEmail(email);
    if (targetUser) {
      const alreadyMember = await this.workspaceRepo.checkUserInWorkspace(
        workspaceId,
        targetUser.id,
      );

      if (alreadyMember) {
        throw new BadRequestError(
          "This user is already a member of the workspace",
        );
      }
    }

    const inviteToken = generateInviteToken({
      workspaceId,
      email,
      invitedBy: user.id,
    });

    await this.mailService.sendInviteEmail(email, inviteToken);

    return { message: "Invite sent successfully" };
  }

  async acceptInvite(inviteToken: string) {
    const payload = verifyInviteToken(inviteToken);

    if (!payload) {
      throw new BadRequestError("Invalid or expired invite link");
    }

    const receiveResult = await this.userRepo
      .findByEmail(payload.email)
    const receiveUser = receiveResult!.get({ plain: true });

    // Prevent duplicate membership
    const alreadyMember = await this.workspaceRepo.checkUserInWorkspace(
      payload.workspaceId,
      receiveUser.id,
    );

    if (alreadyMember) {
      throw new BadRequestError("You are already a member of this workspace");
    }

    // Ensure the workspace still exists
    const workspace = await this.workspaceRepo.findOne(payload.workspaceId);
    if (!workspace) {
      throw new NotFoundError("The workspace no longer exists");
    }

    await this.workspaceRepo.addMember(
      payload.workspaceId,
      receiveUser.id,
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
      throw new BadRequestError("You are not allowed to delete this workspace");
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
      throw new BadRequestError("Only the workspace owner can remove members");
    }

    if (targetUserId === user.id) {
      throw new BadRequestError(
        "You cannot remove yourself from the workspace",
      );
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
