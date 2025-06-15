import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { IDestinationService } from "../interfaces/destination.service.interface";
import { STATUS_CODES } from "../config/constants/status-code";
import { MESSAGES } from "../config/constants/messages";
import { deleteCache } from "../utils/cache.utils";

export class DestinationController {
  constructor(private _destinationService: IDestinationService) {}
  createDestination = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const accountId = req.params.accountId;
      const userId = (req as AuthRequest).userId;
      const { url, httpMethod, headers } = req.body;

      if (!url || !httpMethod || !headers) {
        res.status(400).json({
          success: false,
          message: "Missing required fields: url, http_method, headers",
        });
        return;
      }

      const createdDestination =
        await this._destinationService.createDestination(accountId, userId, {
          url,
          httpMethod,
          headers,
        });
        await deleteCache(`destinations:${accountId}`);

      res.status(201).json({
        success: true,
        message: MESSAGES.DESTINATION_CREATED,
        data: createdDestination,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllDestinationsByAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { accountId } = req.params;
      const userId = (req as AuthRequest).userId;

      const { method, search } = req.query;

      const destinations =
        await this._destinationService.getByAccountIdWithFilter({
          accountId,
          userId,
          method: method as string,
          search: search as string,
        });

      res.status(STATUS_CODES.OK).json({
        message:MESSAGES.DESTINATION_FETCHED,
        success: true,
        data: destinations,
      });
    } catch (error) {
      next(error);
    }
  };

  updateDestination = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = (req as AuthRequest).userId;
      const accountId = req.params.accountId;
      const destinationId = req.params.destinationId;
      const data = req.body;

      const result = await this._destinationService.updateDestination(
        accountId,
        userId,
        destinationId,
        data
      );
      await deleteCache(`destinations:${accountId}`);
      res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.DESTINATION_UPDATED,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteDestination = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = (req as AuthRequest).userId;
      console.log(userId);
      
      const accountId = req.params.accountId;
      const destinationId = req.params.destinationId;

      await this._destinationService.deleteDestination(
        accountId,
        userId,
        destinationId
      );
      await deleteCache(`destinations:${accountId}`);
      res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.DESTINATION_DELETED,
      });
    } catch (error) {
      next(error);
    }
  };
}
