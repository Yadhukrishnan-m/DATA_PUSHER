import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { IAccountService } from "../interfaces/account.service.interface";
import { STATUS_CODES } from "../config/constants/status-code";
import { MESSAGES } from "../config/constants/messages";
import { deleteCache } from "../utils/cache.utils";
interface AccountFilters {
  name?: string;
  fromDate?: string;
  toDate?: string;
}
export class AccountController {
  constructor(private _accountService: IAccountService) {}
  createAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as AuthRequest).userId;
      const data = req.body;

      const account = await this._accountService.createAccount(data, userId);

      res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: MESSAGES.ACCOUNT_CREATED,
        data: account,
      });
    } catch (error) {
      next(error);
    }
  };
  getAllAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as AuthRequest).userId;
      const filters: AccountFilters = {
        name: req.query.name as string | undefined,
        fromDate: req.query.fromDate as string | undefined,
        toDate: req.query.toDate as string | undefined,
      };

      const accounts = await this._accountService.getAllAccounts(
        userId,
        filters
      );

      res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.ACCOUNTS_FETCHED,
        data: accounts,
      });
    } catch (error) {
      next(error);
    }
  };
  updateAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accountId = req.params.id;
      const userId = (req as AuthRequest).userId;
      const updateData = req.body;

      const updatedAccount = await this._accountService.updateAccount(
        accountId,
        userId,
        updateData
      );
      await deleteCache(`account:${updatedAccount.appSecretToken}`);

      res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.ACCOUNT_UPDATED,
        data: updatedAccount,
      });
    } catch (error) {
      next(error);
    }
  };
  getAccountById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accountId = req.params.id;
      const userId = (req as AuthRequest).userId;
      const account = await this._accountService.getAccountById(
        accountId,
        userId
      );

      res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.ACCOUNTS_FETCHED,
        data: account,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accountId = req.params.id;
      const userId = (req as AuthRequest).userId;

      await this._accountService.deleteAccount(accountId, userId);

      res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.ACCOUNT_DELETED,
      });
    } catch (error) {
      next(error);
    }
  };
 
}
