import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { IAccountMemberService } from "../interfaces/accountMember.service.interface";
import { STATUS_CODES } from "../config/constants/status-code";
import { MESSAGES } from "../config/constants/messages";

export class AccountMemberController {
  constructor(private _accountMemberService: IAccountMemberService) {}

  addUserToAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { accountId, userId, role } = req.body;
      const creatorId = (req as AuthRequest).userId;
      const result = await this._accountMemberService.addUserToAccount({
        accountId,
        userId,
        role,
        createdBy: creatorId,
      });
      res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: MESSAGES.USER_ADDED,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getMembersOfAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const accountId = req.params.accountId;
      const userId = (req as AuthRequest).userId;

      const members = await this._accountMemberService.getMembersOfAccount(
        accountId,
        userId
      );

      res.status(200).json({
        success: true,
        data: members,
      });
    } catch (error) {
      next(error);
    }
  };
  changeUserRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requesterUserId = (req as AuthRequest).userId;

      const { accountId, userId: targetUserId } = req.params;
      const { newRoleName } = req.body;

      await this._accountMemberService.changeRole(
        requesterUserId,
        targetUserId,
        accountId,
        newRoleName
      );

      res.status(200).json({ message: MESSAGES.ROLE_UPDATED });
    } catch (error) {
      next(error);
    }
  };

   removeUser=async(req: Request, res: Response, next: NextFunction)=> {
    try {
      const requesterUserId = (req as AuthRequest).userId;
      const { accountId, userId: targetUserId } = req.params;

      await this._accountMemberService.removeUser(
        requesterUserId,
        targetUserId,
        accountId
      );
      res
        .status(200)
        .json({ message: MESSAGES.USER_REMOVED });
    } catch (error) {
      next(error);
    }
  }
}
