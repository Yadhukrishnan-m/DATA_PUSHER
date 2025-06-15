import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { MESSAGES } from "../config/constants/messages";
import { STATUS_CODES } from "../config/constants/status-code";
import { CustomError } from "../utils/CustomError";

export class AuthController {
  constructor(private _authService: AuthService) {}

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;
      const tokens = await this._authService.register(email, password);
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res
        .status(STATUS_CODES.CREATED)
        .json({ success: true, message: MESSAGES.REGISTERED, tokens });
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;
      const tokens = await this._authService.login(email, password);
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res
        .status(200)
        .json({ success: true, message: MESSAGES.LOGIN_SUCCESS, tokens });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
        const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;

      if (!refreshToken) {
        throw new CustomError(
          MESSAGES.TOKEN_NOT_FOUND,
          STATUS_CODES.UNAUTHORIZED
        );
      }

      const token = await this._authService.refreshToken(refreshToken);

      res.status(200).json({ success: true, ...token });
    } catch (error) {
      next(error);
    }
  };

  logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.clearCookie("refreshToken");

      res.status(200).json({
        success: true,
        message: MESSAGES.LOGOUT_SUCCESS ,
      });
    } catch (error) {
      next(error);
    }
  };
}
