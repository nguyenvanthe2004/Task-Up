import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import User from "./User";
import Space from "./Space";

interface WorkspaceAttributes {
  id: number;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  ownerId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface WorkspaceCreationAttributes extends Optional<
  WorkspaceAttributes,
  "id"
> {}

export class Workspace
  extends Model<WorkspaceAttributes, WorkspaceCreationAttributes>
  implements WorkspaceAttributes
{
  declare id: number;
  declare name: string;
  declare description: string;
  declare icon: string;
  declare color: string;
  declare ownerId: number;
  declare readonly Users?: User[];
  declare readonly Space?: Space;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Workspace.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "workspaces",
    timestamps: true,
  },
);

export default Workspace;
