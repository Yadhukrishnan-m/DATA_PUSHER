import { ILog } from "../models/log.model";

export interface ILogRepository {
  findLogsByAccount(
    accountId: string,
    filters: {
      destinationId?: string;
      status?: "success" | "failed";
      fromDate?: Date;
      toDate?: Date;
    }
  ): Promise<ILog[]>;
}
