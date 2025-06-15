import { Role } from "../models/role.model";
import { IAccountMemberRepository } from "../interfaces/accountMember.repository.interface";
import { AccountMember, IAccountMember } from "../models/accountMember.model"; 
import { User } from "../models/user.model";

export class AccountMemberRepository implements IAccountMemberRepository {
  async create(data: any): Promise<AccountMember> {
    return await AccountMember.create(data);
  }
  async isMember(userId: string, accountId: string): Promise<boolean> {
    const member = await AccountMember.findOne({
      where: { userId, accountId },
    });

    return !!member;
  }
  async isUserAdmin(accountId: string, userId: string): Promise<boolean> {
    const member = await AccountMember.findOne({
      where: {
        accountId,
        userId,
      },
      include: [
        {
          model: Role,
          where: { roleName: "Admin" },
          attributes: [],
        },
      ],
    });
    return !!member;
  }
  async findByAccountAndUser(
    accountId: string,
    userId: string
  ): Promise<IAccountMember | null> {
    return await AccountMember.findOne({
      where: {
        accountId,
        userId,
      },
    });
  }
  async findByAccountId(accountId: string): Promise<IAccountMember[]> {
    return await AccountMember.findAll({
      where: { accountId },
      include: [
        { model: User, attributes: ["email"] },
        { model: Role, attributes: ["roleName"] },
      ],
    });
  }
  async removeUserFromAccount(
    userId: string,
    accountId: string
  ): Promise<number> {
    const deletedCount = await AccountMember.destroy({
      where: { userId, accountId },
    });
    return deletedCount; 
  }

  async changeUserRole(
    userId: string,
    accountId: string,
    roleId: string
  ): Promise<[number, IAccountMember[]]> {
    const result = await AccountMember.update(
      { roleId },
      {
        where: { userId, accountId },
        returning: true, 
      }
    );
    return result; 
  }
}
