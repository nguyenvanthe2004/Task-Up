import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

export enum NotificationType {
  TASK = "task",
  COMMENT = "comment",
  ATTACHMENT = "attachment",
  ACTIVITY = "activity",
  SYSTEM = "system",
}

interface NotificationAttributes {
  id: number;
  userId: number;
  taskId: number;
  type: NotificationType;
  title: string;
  message: string;
  referenceId?: number;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface NotificationCreationAttributes
  extends Optional<NotificationAttributes, "id" | "referenceId" | "isRead"> {}

export class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  declare id: number;
  declare userId: number;
  declare taskId: number;
  declare type: NotificationType;
  declare title: string;
  declare message: string;
  declare referenceId?: number;
  declare isRead: boolean;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(NotificationType)),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    referenceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "notifications",
    timestamps: true,
  },
);

export default Notification;
