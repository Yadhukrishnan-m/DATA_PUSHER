
import { CustomError } from "../utils/CustomError";
import { STATUS_CODES } from "../config/constants/status-code";
import { ILogRepository } from "../interfaces/log.repository.interface";
import { IAccountMemberRepository } from "../interfaces/accountMember.repository.interface";
import { MESSAGES } from "../config/constants/messages";

export class LogService {
  constructor(
    private logRepo: ILogRepository,
    private accountMemberRepo: IAccountMemberRepository
  ) {}

  async getLogsByAccount(
    userId: string,
    accountId: string,
    filters: {
      destinationId?: string;
      status?: "success" | "failed";
      fromDate?: Date;
      toDate?: Date;
    }
  ) {
    const isMember = await this.accountMemberRepo.isMember(
      userId,
      accountId
    );
    if (!isMember) {
      throw new CustomError(
        MESSAGES.NOT_A_MEMBER,
        STATUS_CODES.FORBIDDEN
      );
    }

    const logs = await this.logRepo.findLogsByAccount(accountId, filters);
    return logs;
  }
}
