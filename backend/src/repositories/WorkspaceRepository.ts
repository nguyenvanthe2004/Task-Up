import { Service } from "typedi";
import { CreateWorkSpaceInput } from "../types/workspace";
import Workspace from "../models/Workspace";
import UserWorkspace, { WorkspaceRole } from "../models/UserWorkspace";
import { User } from "../models";

@Service()
export class WorkspaceRepository {
  async countAll() {
    return await Workspace.count();
  }

  async checkUserInWorkspace(workspaceId: number, userId: number) {
    const record = await UserWorkspace.findOne({
      where: {
        workspaceId,
        userId,
      },
    });

    return !!record;
  }

  async findAll(skip: number, limit: number) {
    return await Workspace.findAll({
      offset: skip,
      limit,
      raw: true,
    });
  }

  async findOne(id: number) {
    return await Workspace.findByPk(id);
  }

  async findByOwnerId(ownerId: number) {
    return await Workspace.findAll({ where: { ownerId }, raw: true });
  }

  async findMembers(workspaceId: number) {
  return await Workspace.findByPk(workspaceId, {
    include: [
      {
        model: User,
        as: "users",
        attributes: ["id", "fullName", "email", "avatar"],
        through: {
          attributes: ["role", "invitedBy", "acceptedAt"],
        },
      },
      {
        model: UserWorkspace,
        as: "userWorkspaces",
        include: [
          {
            model: User,
            as: "inviter",
            attributes: ["id", "email"],
          },
        ],
      },
    ],
  });
}

  async findByUser(userId: number) {
    return await Workspace.findAll({
      include: [
        {
          association: "users",
          where: { id: userId },
          attributes: [],
          through: {
            attributes: [],
          },
        },
      ],
      raw: true,
    });
  }

  async createWithMembers(ownerId: number, data: CreateWorkSpaceInput) {
    const workspace = await Workspace.create({
      ...data,
      ownerId,
    });

    await UserWorkspace.create({
      userId: ownerId,
      workspaceId: workspace.id,
      role: WorkspaceRole.OWNER,
    });

    return workspace;
  }

  async addMember(
    workspaceId: number,
    userId: number,
    role?: WorkspaceRole,
    invitedBy?: number,
  ) {
    return await UserWorkspace.create({
      workspaceId,
      userId,
      role,
      invitedBy,
      acceptedAt: new Date(),
    });
  }

  async update(id: number, data: Partial<Workspace>) {
    await Workspace.update(data, {
      where: { id },
    });

    return await Workspace.findByPk(id);
  }
  async delete(id: number) {
    return await Workspace.destroy({
      where: { id },
    });
  }
  async removeMember(workspaceId: number, userId: number) {
    return await UserWorkspace.destroy({
      where: {
        workspaceId,
        userId,
      },
    });
  }
}
