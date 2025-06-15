import { Request, Response, NextFunction } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import redisClient from "../config/redis.config";
import { MESSAGES } from "../config/constants/messages";
import { STATUS_CODES } from "../config/constants/status-code";

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rl_incoming_data",
  duration: 1, 
  points: 5, 
});

export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header("CL-X-TOKEN");

  if (!token) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.TOKEN_NOT_FOUND,
    });
    return;
  }

  try {
    await rateLimiter.consume(token);
    next();
  } catch {
    res.status(429).json({
      success: false,
      message: MESSAGES.RATE_LIMITED,
    });
  }
};
