import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.config";

export class Role extends Model {
  declare id: string;
  declare roleName: "Admin" | "Normal user";
}

export interface IRole {
  id: string;
  roleName: "Admin" | "Normal user";
}

Role.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    roleName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, modelName: "Role",  }
);
