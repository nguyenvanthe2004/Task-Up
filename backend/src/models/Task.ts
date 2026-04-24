import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import User from "./User";

export enum PriorityStatus {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
  URGENT = "urgent",
}

interface TaskAttributes {
  id: number;
  name: string;
  description: string; // react quill
  priority?: PriorityStatus;
  tag?: string;
  startDate?: Date;
  dueDate?: Date;
  statusId: number;
  listId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TaskCreationAttributes extends Optional<TaskAttributes, "id"> {}

export class Task
  extends Model<TaskAttributes, TaskCreationAttributes>
  implements TaskAttributes
{
  declare id: number;
  declare name: string;
  declare description: string;
  declare priority?: PriorityStatus;
  declare tag?: string;
  declare startDate?: Date;
  declare dueDate?: Date;
  declare statusId: number;
  declare listId: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Task.init(
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
      type: DataTypes.TEXT,
      allowNull: false,
    },

    priority: {
      type: DataTypes.ENUM(...Object.values(PriorityStatus)),
      allowNull: true,
      defaultValue: PriorityStatus.LOW,
    },

    tag: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    listId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "tasks",
    timestamps: true,
  },
);

export default Task;
