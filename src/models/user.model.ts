import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.config";

export class User extends Model {
  declare id: string;
  declare email: string;
  declare password: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export interface IUser {
  id: string; 
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, modelName: "User", timestamps: true }
);
