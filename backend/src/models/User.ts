import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import { Workspace } from "../types/workspace";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

interface UserAttributes {
  id: number;
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  verifyCode?: string;
  isActive: boolean;
  Workspaces?: Workspace[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number;
  declare fullName: string;
  declare email: string;
  declare password: string;
  declare phone?: string;
  declare avatar?: string;
  declare role: UserRole;
  declare verifyCode: string;
  declare isActive: boolean;
  declare readonly Workspaces?: Workspace[];

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      defaultValue: UserRole.USER,
    },
    verifyCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  },
);

export default User;
