import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.config";

export class Destination extends Model {
  declare id: string;
  declare accountId: string;
  declare url: string;
  declare httpMethod: "POST" | "PUT" | "PATCH" | "GET" | "DELETE";
  declare headers: object;
  declare createdBy: string;
  declare updatedBy: string;
}

export interface IDestination {
  id: string;
  accountId: string;
  url: string;
  httpMethod: "POST" | "PUT" | "PATCH" | "GET" | "DELETE";
  headers: object;
  createdBy: string;
  updatedBy: string;
}

Destination.init(
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
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    httpMethod: {
      type: DataTypes.ENUM("POST", "PUT", "PATCH","GET","DELETE"),
      allowNull: false,
    },
    headers: {
      type: DataTypes.JSON,
      allowNull: false,
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
  { sequelize, modelName: "Destination", timestamps: true }
);
