import { Op } from "sequelize";
import { IDestinationRepository } from "../interfaces/destination.repository.interface";
import { Destination, IDestination } from "../models/destination.model";

export class DestinationRepository implements IDestinationRepository {
  async create(
    destinationData: Omit<IDestination, "id">
  ): Promise<IDestination> {
    return await Destination.create(destinationData);
  }

  async findByAccountIdWithFilters(
    accountId: string,
    method?: string,
    search?: string
  ): Promise<IDestination[] | null> {
    const where: any = { accountId };

    if (method) {
      where.httpMethod = method.toUpperCase();
    }

    if (search) {
      where.url = { [Op.like]: `%${search}%` };
    }

    return await Destination.findAll({ where });
  }

  async update(destinationId: string, data: any): Promise<IDestination | null> {
    await Destination.update(data, { where: { id: destinationId } });
    return await Destination.findByPk(destinationId);
  }

  async delete(destinationId: string): Promise<number> {
    return await Destination.destroy({ where: { id: destinationId } });
  }
  async findById(id: string): Promise<IDestination | null> {
    return Destination.findByPk(id);
  }
  async findByAccountId(accountId: string): Promise<IDestination[] | null> {
    return Destination.findAll({
      where: { accountId },
      attributes: ["id", "url", "httpMethod", "headers"],
    });
  }
}
