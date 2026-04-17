import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import sequelize from "../config/db";

export enum WorkspaceRole {
  OWNER = "owner",
  MEMBER = "member",
}

export class UserWorkspace extends Model<
  InferAttributes<UserWorkspace>,
  InferCreationAttributes<UserWorkspace>
> {
  declare userId: number;
  declare workspaceId: number;
  declare role?: WorkspaceRole;
  declare invitedBy?: number;
  declare acceptedAt?: Date;
}

UserWorkspace.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    workspaceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: { model: "workspaces", key: "id" },
      onDelete: "CASCADE",
    },
    role: {
      type: DataTypes.ENUM(...Object.values(WorkspaceRole)),
      allowNull: false,
      defaultValue: WorkspaceRole.MEMBER,
    },
     invitedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    acceptedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "user_workspaces",
    timestamps: false,
  },
);

export default UserWorkspace;
