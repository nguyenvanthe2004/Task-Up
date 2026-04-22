import { Service } from "typedi";
import Space from "../models/Space";
import UserSpace from "../models/UserSpace";
import UserWorkspace from "../models/UserWorkspace";
import { Category, List, User, Workspace } from "../models";
import { CreateSpaceInput, UpdateSpaceInput } from "../types/space";

@Service()
export class SpaceRepository {
  async findById(id: number) {
    return await Space.findOne({
      where: { id },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "members",
          attributes: ["id", "fullName", "email", "avatar"],
          through: { attributes: [] },
        },
        {
          model: Workspace,
          as: "workspace",
          attributes: ["id", "name", "ownerId"],
          include: [
            {
              model: UserWorkspace,
              as: "userWorkspaces",
              include: [
                {
                  model: User,
                  as: "inviter",
                  attributes: ["id", "email", "fullName"],
                },
              ],
            },
          ],
        },
      ],
    });
  }

  async findAll(workspaceId?: number) {
    const whereClause = workspaceId !== undefined ? { workspaceId } : {};

    return await Space.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "members",
          attributes: ["id", "fullName", "email", "avatar"],
          through: { attributes: [] },
        },
        {
          model: Workspace,
          as: "workspace",
          attributes: ["id", "name", "ownerId"],
          include: [
            {
              model: UserWorkspace,
              as: "userWorkspaces",
              include: [
                {
                  model: User,
                  as: "inviter",
                  attributes: ["id", "email", "fullName"],
                },
              ],
            },
          ],
        },
        {
          model: Category,
          as: "categories",
          include: [
            {
              model: List,
              as: "lists",
            },
          ],
        },
      ],
    });
  }

  async checkUserInSpace(spaceId: number, userId: number) {
    const record = await UserSpace.findOne({
      where: { spaceId, userId },
    });
    return !!record;
  }

  async checkUserInWorkspace(workspaceId: number, userId: number) {
    const record = await UserWorkspace.findOne({
      where: { workspaceId, userId },
    });
    return !!record;
  }

  async findMembers(spaceId: number) {
    return await Space.findByPk(spaceId, {
      include: [
        {
          model: User,
          as: "members",
          attributes: ["id", "fullName", "email", "avatar"],
          through: {
            attributes: [],
          },
        },
      ],
    });
  }

  async create(workspaceId: number, data: CreateSpaceInput) {
    return await Space.create({
      ...data,
      workspaceId,
    });
  }

  async addMember(spaceId: number, userId: number) {
    const existing = await UserSpace.findOne({
      where: { spaceId, userId },
    });
    if (existing) return existing;

    return await UserSpace.create({ spaceId, userId });
  }

  async addMembers(spaceId: number, userIds: number[]) {
    const existing = await UserSpace.findAll({
      where: { spaceId },
      attributes: ["userId"],
    });

    const existingIds = existing.map((e) => e.userId);
    const newIds = userIds.filter((id) => !existingIds.includes(id));

    if (newIds.length === 0) return [];

    return await UserSpace.bulkCreate(
      newIds.map((userId) => ({ spaceId, userId })),
    );
  }

  async removeMember(spaceId: number, userId: number) {
    return await UserSpace.destroy({
      where: { spaceId, userId },
    });
  }

  async update(id: number, data: UpdateSpaceInput) {
    await Space.update(data, { where: { id } });
    return await Space.findByPk(id);
  }

  async delete(id: number) {
    return await Space.destroy({ where: { id } });
  }

  async countByWorkspace(workspaceId: number) {
    return await Space.count({ where: { workspaceId } });
  }
}
