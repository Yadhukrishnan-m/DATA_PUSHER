import { getCache, setCache } from "../utils/cache.utils";
import { processToQueue } from "../queue/dataQueue";
import { CustomError } from "../utils/CustomError";
import { MESSAGES } from "../config/constants/messages";
import { STATUS_CODES } from "../config/constants/status-code";
import { IAccountRepository } from "../interfaces/account.repository.interface";
import { IDestinationRepository } from "../interfaces/destination.repository.interface";
import { IDataHandlerService } from "../interfaces/datahandler.service.interface";

export class DataHandlerService implements IDataHandlerService {
  constructor(
    private _accountRepo: IAccountRepository,
    private _destinationRepo: IDestinationRepository
  ) {}

  async processIncomingData(
    token: string,
    eventId: string,
    payload: any
  ): Promise<boolean> {
    if (!token)
      throw new CustomError(MESSAGES.TOKEN_NOT_FOUND, STATUS_CODES.BAD_REQUEST);
    if (!eventId)
      throw new CustomError(
        MESSAGES.EVENT_ID_NOT_FOUND,
        STATUS_CODES.BAD_REQUEST
      );
    const accountCacheKey = `account:${token}`;
    let account = await getCache(accountCacheKey);
    
    if (
      !payload ||
      (typeof payload === "object" && Object.keys(payload).length === 0)
    ) {
      throw new CustomError(MESSAGES.INVALID_DATA, STATUS_CODES.BAD_REQUEST);
    }
      

    if (!account) {
      account = await this._accountRepo.findByToken(token);
      if (!account)
        throw new CustomError(MESSAGES.INVALID_TOKEN, STATUS_CODES.BAD_REQUEST);
      await setCache(accountCacheKey, account);
    }
    const destCacheKey = `destinations:${account.id}`;
    let destinations = await getCache(destCacheKey);

    
    if (!destinations) {
      destinations = await this._destinationRepo.findByAccountId(
        account.id
      );
      await setCache(destCacheKey, destinations);
    }

    await processToQueue(account.id, eventId, payload, destinations);

    return true;
  }
}
