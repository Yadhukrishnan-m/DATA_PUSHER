import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "access_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";

export class JwtUtil {
  static generateAccessToken(userId: string): string {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1500m" });
  }

  static generateRefreshToken(userId: string): string {
    return jwt.sign({ id: userId }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
  }

  static verifyAccessToken(token: string): string | jwt.JwtPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  static verifyRefreshToken(token: string): string | null | jwt.JwtPayload {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET);
    } catch (error) {
      return null;
    }
  }
}
