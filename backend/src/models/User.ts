import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db"; // file connect MySQL

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
  createdAt?: Date;
  updatedAt?: Date;
}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public fullName!: string;
  public email!: string;
  public password!: string;
  public phone?: string;
  public avatar?: string;
  public role!: UserRole;
  public verifyCode?: string;
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
