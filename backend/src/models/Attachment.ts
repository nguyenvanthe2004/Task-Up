import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface AttachmentAttributes {
  id: number;
  taskId: number;
  fileUrl: string;
  fileName: string;
  type: string;
  uploadedBy: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AttachmentCreationAttributes extends Optional<AttachmentAttributes, "id"> {}

export class Attachment
  extends Model<AttachmentAttributes, AttachmentCreationAttributes>
  implements AttachmentAttributes
{
  declare id: number;
  declare taskId: number;
  declare fileUrl: string;
  declare fileName: string;
  declare type: string;
  declare uploadedBy: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Attachment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "attachments",
    timestamps: true,
  },
);

export default Attachment;
