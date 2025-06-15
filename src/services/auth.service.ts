import bcrypt from "bcrypt";
import { JwtUtil } from "../utils/jwt";
import { IUserRepository } from "../interfaces/user.repository.interface";
import { CustomError } from "../utils/CustomError";
import { MESSAGES } from "../config/constants/messages";
import { STATUS_CODES } from "../config/constants/status-code";
import { IAuthService } from "../interfaces/auth.service.interface";

export class AuthService implements IAuthService {
  constructor(private _userRepo: IUserRepository) {}

  async register(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string ,userId:string}> {
    const existing = await this._userRepo.findByEmail(email);
    if (existing)
      throw new CustomError(
        MESSAGES.EMAIL_ALREADY_EXISTS,
        STATUS_CODES.CONFLICT
      );

    const hashed = await bcrypt.hash(password, 10);
    const user = await this._userRepo.createUser(email, hashed);
    if (!user) {
      throw new CustomError(MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }
    return {
      accessToken: JwtUtil.generateAccessToken(user.id),
      refreshToken: JwtUtil.generateRefreshToken(user.id),
      userId: user.id,
    };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string,userId:string }> {
    const user = await this._userRepo.findByEmail(email);
    if (!user)
      throw new CustomError(
        MESSAGES.INVALID_CREDENTIALS,
        STATUS_CODES.UNAUTHORIZED
      );

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      throw new CustomError(
        MESSAGES.INVALID_CREDENTIALS,
        STATUS_CODES.UNAUTHORIZED
      );

    return {
      accessToken: JwtUtil.generateAccessToken(user.id),
      refreshToken: JwtUtil.generateRefreshToken(user.id),
      userId: user.id,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const payload = JwtUtil.verifyRefreshToken(refreshToken);
    console.log(payload);

    if (
      !payload ||
      typeof payload === "string" ||
      typeof payload !== "object" ||
      !("id" in payload)
    ) {
      throw new CustomError(MESSAGES.INVALID_TOKEN, STATUS_CODES.UNAUTHORIZED);
    }
    const newAccessToken = JwtUtil.generateAccessToken(payload.id);
    return { accessToken: newAccessToken };
  }
}
