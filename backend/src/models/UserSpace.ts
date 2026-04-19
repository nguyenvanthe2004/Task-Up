// models/UserSpace.ts
import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import sequelize from "../config/db";

export class UserSpace extends Model<
  InferAttributes<UserSpace>,
  InferCreationAttributes<UserSpace>
> {
  declare userId: number;
  declare spaceId: number;
}

UserSpace.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    spaceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: { model: "spaces", key: "id" },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "user_spaces",
    timestamps: false,
  },
);

export default UserSpace;
