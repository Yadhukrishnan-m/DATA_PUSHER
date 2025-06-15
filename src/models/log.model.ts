import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.config";

export class Log extends Model {
  declare id: string;
  declare eventId: string;
  declare accountId: string;
  declare destinationId: string;
  declare receivedData: object;
  declare receivedTimestamp: Date;
  declare processedTimestamp: Date;
  declare status: "success" | "failed";
}

export interface ILog {
  id: string;
  eventId: string;
  accountId: string;
  destinationId: string;
  receivedData: object;
  receivedTimestamp: Date;
  processedTimestamp: Date;
  status: "success" | "failed";
}

Log.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    eventId: {
      type: DataTypes.STRING,
   
      allowNull: false,
    },
    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    destinationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    receivedData: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    receivedTimestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    processedTimestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("success", "failed"),
      allowNull: false,
    },
  },
  { sequelize, modelName: "Log", timestamps: false }
);
