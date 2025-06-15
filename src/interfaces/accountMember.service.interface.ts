import { IAccountMember } from "../models/accountMember.model";
export interface IAccountMemberService {
  addUserToAccount(input: {
    accountId: string;
    userId: string;
    role: string;
    createdBy: string;
  }): Promise<IAccountMember>;
  getMembersOfAccount(
    accountId: string,
    userId: string
  ): Promise<IAccountMember[] | null>;
  changeRole(
    requesterUserId: string,
    targetUserId: string,
    accountId: string,
    newRoleName: string
  ): Promise<void>;

  removeUser(
    requesterUserId: string,
    targetUserId: string,
    accountId: string
  ): Promise<void>;
}
