import { IAccount } from "../models/account.model";
import { IAccountRepository } from "../interfaces/account.repository.interface";
import { IAccountMemberRepository } from "../interfaces/accountMember.repository.interface";
import { v4 as uuidv4 } from "uuid";
import { CustomError } from "../utils/CustomError";
import { MESSAGES } from "../config/constants/messages";
import { STATUS_CODES } from "../config/constants/status-code";
import { IRoleRepository } from "../interfaces/role.repository.interface";
import crypto from "crypto";
import { IAccountService } from "../interfaces/account.service.interface";
import { IUser } from "../models/user.model";
import { IUserRepository } from "../interfaces/user.repository.interface";

export class AccountService implements IAccountService {
  constructor(
    private accountRepo: IAccountRepository,
    private memberRepo: IAccountMemberRepository,
    private roleRepo: IRoleRepository,
    private userRepo: IUserRepository
  ) {}

  async createAccount(
    data: Pick<IAccount, "accountName" | "website">,
    userId: string
  ) {
    const accountId = uuidv4();

    const appSecretToken = crypto.randomBytes(32).toString("hex");

    const user = await this.userRepo.findById(userId);
    if (!user) {
        throw new CustomError(MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
    }

    const account = await this.accountRepo.create({
      id: accountId,
      accountName: data.accountName,
      website: data.website,
      appSecretToken,
      createdBy: userId,
      updatedBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const adminRole = await this.roleRepo.findByName("Admin");
    if (!adminRole) {
      throw new CustomError(MESSAGES.ROLE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    await this.memberRepo.create({
      id: uuidv4(),
      accountId,
      userId,
      roleId: adminRole.id,
      createdBy: userId,
      updatedBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return account;
  }

  async getAllAccounts(
    userId: string,
    filters: {
      name?: string;
      fromDate?: string;
      toDate?: string;
    }
  ): Promise<IAccount[]> {
    return this.accountRepo.findAll(userId, filters);
  }

  async updateAccount(
    accountId: string,
    userId: string,
    updateData: any
  ): Promise<IAccount> {
    const isMember = await this.memberRepo.isMember(userId, accountId);
    if (!isMember) {
      throw new CustomError(
        MESSAGES.UNAUTHORIZED_ACCESS,
        STATUS_CODES.FORBIDDEN
      );
    }

    updateData.updatedBy = userId;
    const updated = await this.accountRepo.update(accountId, updateData);
    if (!updated) {
      throw new CustomError(MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }
    return updated;
  }

  async getAccountById(accountId: string, userId: string): Promise<IAccount> {
    const ismember = await this.memberRepo.isMember(userId, accountId);
    if (!ismember) {
      throw new CustomError(MESSAGES.NOT_A_MEMBER, STATUS_CODES.UNAUTHORIZED);
    }
    const account = await this.accountRepo.findById(accountId);
    if (!account) {
      throw new CustomError(MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }
    return account;
  }
  async deleteAccount(accountId: string, userId: string): Promise<void> {
    const isAdmin = await this.memberRepo.isUserAdmin(accountId, userId);
    if (!isAdmin) {
        throw new CustomError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    }
    await this.accountRepo.deleteById(accountId);
  }
}
