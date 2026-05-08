import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import User from "./User";

interface ActivityAttributes {
  id: number;
  action: string;
  taskId: number;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ActivityCreationAttributes extends Optional<ActivityAttributes, "id"> {}

export class Activity
  extends Model<ActivityAttributes, ActivityCreationAttributes>
  implements ActivityAttributes
{
  declare id: number;
  declare action: string;
  declare taskId: number;
  declare userId: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Activity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "activities",
    timestamps: true,
  },
);

export default Activity;
