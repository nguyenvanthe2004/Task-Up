import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface ListAttributes {
  id: number;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  isPublic?: boolean;
  categoryId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ListCreationAttributes extends Optional<ListAttributes, "id"> {}

export class List
  extends Model<ListAttributes, ListCreationAttributes>
  implements ListAttributes
{
  declare id: number;
  declare name: string;
  declare description: string;
  declare icon: string;
  declare color: string;
  declare isPublic: boolean;
  declare categoryId: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

List.init(
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
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "lists",
    timestamps: true,
  },
);

export default List;
