import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import sequelize from "../config/db";

export class TaskAssignee extends Model<
  InferAttributes<TaskAssignee>,
  InferCreationAttributes<TaskAssignee>
> {
  declare userId: number;
  declare taskId: number;
}

TaskAssignee.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: { model: "tasks", key: "id" },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "task_assignees",
    timestamps: false,
  },
);

export default TaskAssignee;
