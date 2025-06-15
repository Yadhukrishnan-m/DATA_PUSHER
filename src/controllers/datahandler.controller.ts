// src/controllers/data.controller.ts
import { Request, Response, NextFunction } from "express";
import { MESSAGES } from "../config/constants/messages";
import { STATUS_CODES } from "../config/constants/status-code";
import { IDataHandlerService } from "../interfaces/datahandler.service.interface";

export class DataController {
  constructor(private _dataService: IDataHandlerService) {}

  handleIncomingData = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const token = req.headers["cl-x-token"] as string;
    const eventId = req.headers["cl-x-event-id"] as string;
    const payload = req.body;

    try {
 
      await this._dataService.processIncomingData(token, eventId, payload);
      res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.DATA_RECEIVED,
      });
    } catch (error: any) {
      next(error);
    }
  };
}
