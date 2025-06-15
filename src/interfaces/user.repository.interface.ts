import { IUser } from "../models/user.model";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  createUser(email: string, password: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
}
