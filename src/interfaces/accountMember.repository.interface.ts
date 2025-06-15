import { AccountMember, IAccountMember } from "../models/accountMember.model";
export interface IAccountMemberRepository {
  create(data: IAccountMember): Promise<IAccountMember>;
  isMember(userId: string, accountId: string): Promise<boolean>;
  isUserAdmin(accountId: string, userId: string): Promise<boolean>;
  findByAccountAndUser(
    accountId: string,
    userId: string
  ): Promise<IAccountMember | null>;
  findByAccountId(accountId: string): Promise<IAccountMember[]>;
 changeUserRole(
     userId: string,
     accountId: string,
     roleId: string
   ): Promise<[number, IAccountMember[]]>
  removeUserFromAccount(userId: string, accountId: string): Promise<number>;
}
