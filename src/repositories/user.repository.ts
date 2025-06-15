import { IUserRepository } from "../interfaces/user.repository.interface";
import { IUser, User } from "../models/user.model";

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ where: { email } });
  }
  async findById(id: string): Promise<IUser | null> {
      return User.findByPk(id);
    }

  async createUser(email: string, password: string): Promise<IUser | null> {
    return User.create({ email, password });
  }
}
