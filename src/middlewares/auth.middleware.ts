import { Request, Response, NextFunction } from "express";
import { JwtUtil } from "../utils/jwt";
import { CustomError } from "../utils/CustomError";
import { MESSAGES } from "../config/constants/messages";
import { STATUS_CODES } from "../config/constants/status-code";

export interface AuthRequest extends Request {
  userId: string; 
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new CustomError(
        MESSAGES.TOKEN_NOT_FOUND,
        STATUS_CODES.UNAUTHORIZED
      );
    }

    const token = authHeader.split(" ")[1];
    const payload = JwtUtil.verifyAccessToken(token);

    if (!payload || typeof payload === "string" || !("id" in payload)) {
      throw new CustomError(MESSAGES.INVALID_TOKEN, STATUS_CODES.UNAUTHORIZED);
    }
    (req as AuthRequest).userId = payload.id;

    next();
  } catch (error) {
    next(error);
  }
};
