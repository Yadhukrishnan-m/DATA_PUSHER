import { ILogRepository } from "../interfaces/log.repository.interface";
import { Log } from "../models/log.model";
import { Op } from "sequelize";

export class LogRepository implements ILogRepository {
  async findLogsByAccount(
    accountId: string,
    filters: {
      destinationId?: string;
      status?: "success" | "failed";
      fromDate?: Date;
      toDate?: Date;
    }
  ): Promise<Log[]> {
    const whereClause: any = { accountId };

    if (filters.destinationId)
      whereClause.destinationId = filters.destinationId;
    if (filters.status) whereClause.status = filters.status;

    if (filters.fromDate || filters.toDate) {
      whereClause.receivedTimestamp = {};
      if (filters.fromDate)
        whereClause.receivedTimestamp[Op.gte] = filters.fromDate;
      if (filters.toDate)
        whereClause.receivedTimestamp[Op.lte] = filters.toDate;
    }

    return Log.findAll({
      where: whereClause,
      order: [["receivedTimestamp", "DESC"]],
    });
  }
}
