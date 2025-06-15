import { IAccount } from "../models/account.model";
export interface IAccountRepository {
  create(data: IAccount): Promise<IAccount>;
  findAll(
    userId: string,
    filters: {
      name?: string;
      fromDate?: string;
      toDate?: string;
    }
  ): Promise<IAccount[]>;
  update(accountId: string, updateData: any): Promise<IAccount | null>;
  findById(id: string): Promise<IAccount | null>;
  deleteById(id: string): Promise<any>;
  findByToken(token: string): Promise<IAccount | null>;
}
