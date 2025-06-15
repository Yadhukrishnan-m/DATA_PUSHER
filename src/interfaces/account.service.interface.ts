import { IAccount } from "../models/account.model";

export interface IAccountService {
  createAccount(
    data: Pick<IAccount, "accountName" | "website">,
    userId: string
  ): Promise<IAccount>;
  getAllAccounts(
    userId: string,
    filters: {
      name?: string;
      fromDate?: string;
      toDate?: string;
    }
  ): Promise<IAccount[]>;
  updateAccount(
    accountId: string,
    userId: string,
    updateData: any
  ): Promise<IAccount>;
  getAccountById(accountId: string,userId:string): Promise<IAccount>;
  deleteAccount(accountId: string, userId: string):Promise<void>
}
