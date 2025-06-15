export interface IAuthService {
  register(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string, userId: string }>;
  login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string, userId: string }>;
  refreshToken(refreshToken: string): Promise<{ accessToken: string }>;
}
