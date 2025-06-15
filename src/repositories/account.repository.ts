import { AccountMember } from '../models/accountMember.model';
import { IAccountRepository } from '../interfaces/account.repository.interface';
import { Account, IAccount } from "../models/account.model";
import { Op } from "sequelize";

export class AccountRepository implements IAccountRepository {
  async create(data: any): Promise<IAccount> {
    return await Account.create(data);
  }

  async findAll(
    userId: string,
    filters: {
      name?: string;
      fromDate?: string;
      toDate?: string;
    }
  ): Promise<IAccount[]> {
    const whereClause: any = {};

    if (filters.name) {
      whereClause.accountName = {
        [Op.like]: `${filters.name}%`,
      };
    }

    if (filters.fromDate || filters.toDate) {
      whereClause.createdAt = {};
      if (filters.fromDate)
        whereClause.createdAt[Op.gte] = new Date(filters.fromDate);
      if (filters.toDate)
        whereClause.createdAt[Op.lte] = new Date(filters.toDate);
    }

    return await Account.findAll({
      where: whereClause,
      include: [
        {
          model: AccountMember,
          where: { userId },
          attributes: [],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }
  async update(accountId: string, updateData: any): Promise<IAccount | null> {
    await Account.update(updateData, {
      where: { id: accountId },
    });

    return await Account.findByPk(accountId);
  }

  async findById(id: string): Promise<IAccount | null> {
    return Account.findByPk(id);
  }
  async deleteById(id: string) {
    return Account.destroy({ where: { id } });
  }
  async findByToken(token: string): Promise<IAccount | null> {
    return Account.findOne({ where: { appSecretToken: token } });
  }
}
