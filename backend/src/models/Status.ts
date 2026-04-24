import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface StatusAttributes {
  id: number;
  name: string;
  color: string;
  position: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface StatusCreationAttributes extends Optional<StatusAttributes, "id"> {}

export class Status
  extends Model<StatusAttributes, StatusCreationAttributes>
  implements StatusAttributes
{
  declare id: number;
  declare name: string;
  declare color: string;
  declare position: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Status.init(
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

    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    position: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "statuses",
    timestamps: true,
  },
);

export default Status;
