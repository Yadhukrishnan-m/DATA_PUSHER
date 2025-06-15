import { IAccountMemberService } from "../interfaces/accountMember.service.interface";
import { IAccountMemberRepository } from "../interfaces/accountMember.repository.interface";
import { IRoleRepository } from "../interfaces/role.repository.interface";
import { v4 as uuidv4 } from "uuid";
import { CustomError } from "../utils/CustomError";
import { MESSAGES } from "../config/constants/messages";
import { STATUS_CODES } from "../config/constants/status-code";
import { IAccountMember } from "../models/accountMember.model";
import { IAccountRepository } from "../interfaces/account.repository.interface";
import { IUserRepository } from "../interfaces/user.repository.interface";

interface AddUserInput {
  accountId: string;
  userId: string;
  role: string;
  createdBy: string;
}
export class AccountMemberService implements IAccountMemberService {
  constructor(
    private _memberRepo: IAccountMemberRepository,
    private _roleRepo: IRoleRepository,
    private _accountRepo: IAccountRepository,
    private _userRepo: IUserRepository
  ) {}

  async addUserToAccount(input: AddUserInput): Promise<IAccountMember> {
    const [role, account, user] = await Promise.all([
      this._roleRepo.findByName(input.role),
      this._accountRepo.findById(input.accountId),
      this._userRepo.findById(input.userId),
    ]);

    if (!role) {
      throw new CustomError(MESSAGES.ROLE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    if (!account) {
      throw new CustomError(MESSAGES.ACCOUNT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }
    if (!user) {
      throw new CustomError(MESSAGES.MEMBER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }
    const existingMember = await this._memberRepo.findByAccountAndUser(
      input.accountId,
      input.userId
    );

    if (existingMember) {
      throw new CustomError(
        MESSAGES.MEMBER_ALREADY_EXISTS,
        STATUS_CODES.CONFLICT
      );
    }
    const newMember = await this._memberRepo.create({
      id: uuidv4(),
      accountId: input.accountId,
      userId: input.userId,
      roleId: role.id,
      createdBy: input.createdBy,
      updatedBy: input.createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return newMember;
  }

  async getMembersOfAccount(
    accountId: string,
    userId: string
  ): Promise<IAccountMember[] | null> {
    const isMember = await this._memberRepo.isMember(userId, accountId);
    if (!isMember) {
      throw new CustomError(
        MESSAGES.UNAUTHORIZED_ACCESS,
        STATUS_CODES.FORBIDDEN
      );
    }
    const members = await this._memberRepo.findByAccountId(accountId);
    if (!members) {
      throw new CustomError(MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }
    return members;
  }
  async removeUser(
    requesterUserId: string,
    targetUserId: string,
    accountId: string
  ): Promise<void> {
    const isAdmin = await this._memberRepo.isUserAdmin(
      accountId,
      requesterUserId
    );
    if (!isAdmin) {
      throw new CustomError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    }

    const deletedCount = await this._memberRepo.removeUserFromAccount(
      targetUserId,
      accountId
    );
    if (deletedCount === 0) {
      throw new CustomError(MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }
  }
  async changeRole(
    requesterUserId: string,
    targetUserId: string,
    accountId: string,
    newRoleName: string
  ):Promise<void> {
    const isAdmin = await this._memberRepo.isUserAdmin(
      accountId,
      requesterUserId
    );
    if (!isAdmin) {
      throw new CustomError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    }
    const adminRole = await this._roleRepo.findByName("Admin");
    if (!adminRole) {
      throw new CustomError(MESSAGES.ROLE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }
 await this._memberRepo.changeUserRole(
      targetUserId,
      accountId,
      adminRole.id
    );
  }
}
