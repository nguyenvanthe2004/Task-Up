import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import User from "./User";

interface SpaceAttributes {
  id: number;
  name: string;
  description: string;
  icon?: string;
  workspaceId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SpaceCreationAttributes extends Optional<SpaceAttributes, "id"> {}

export class Space
  extends Model<SpaceAttributes, SpaceCreationAttributes>
  implements SpaceAttributes
{
  declare id: number;
  declare name: string;
  declare description: string;
  declare icon: string;
  declare workspaceId: number;
  declare readonly Users?: User[];

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Space.init(
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
    workspaceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "spaces",
    timestamps: true,
  },
);

export default Space;
