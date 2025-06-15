import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.config";

export class Account extends Model {
  declare id: string;
  declare accountName: string;
  declare appSecretToken: string;
  declare website?: string;
  declare createdBy: string;
  declare updatedBy: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export interface IAccount {
  id: string;
  accountName: string;
  appSecretToken: string;
  website?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
Account.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    accountName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    appSecretToken: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  { sequelize, modelName: "Account", timestamps: true }
);
