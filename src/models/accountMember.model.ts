import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.config";

export class AccountMember extends Model {
  declare id: string;
  declare accountId: string;
  declare userId: string;
  declare roleId: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare createdBy: string;
  declare updatedBy: string;
}
export interface IAccountMember {
  id: string;
  accountId: string;
  userId: string;
  roleId: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}
AccountMember.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { sequelize, modelName: "AccountMember", timestamps: true }
);
