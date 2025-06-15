import { Request, Response, NextFunction } from "express";
import { LogService } from "../services/log.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class LogController {
  constructor(private logService: LogService) {}

  getLogsByAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = (req as AuthRequest).userId;
      const { accountId } = req.params;
      const { destinationId, status, fromDate, toDate } = req.query;

      const filters = {
        destinationId: destinationId as string | undefined,
        status: status as "success" | "failed" | undefined,
        fromDate: fromDate ? new Date(fromDate as string) : undefined,
        toDate: toDate ? new Date(toDate as string) : undefined,
      };

      const logs = await this.logService.getLogsByAccount(
        userId,
        accountId,
        filters
      );
      res.status(200).json({ logs });
    } catch (error) {
      next(error);
    }
  };
}
