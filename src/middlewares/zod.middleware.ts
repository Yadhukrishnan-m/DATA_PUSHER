import { MESSAGES } from "../config/constants/messages";
import { STATUS_CODES } from "../config/constants/status-code";
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
         res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.INVALID_DATA,
          errors: result.error.errors.map((err) => ({
            field: err.path[0],
            message: err.message,
          })),
        });
        return;
    }
    next();
  };
};
