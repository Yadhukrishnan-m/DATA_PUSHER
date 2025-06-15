import { IDestination } from "../models/destination.model";

export interface IDestinationRepository {
  create(destinationData: Omit<IDestination, "id">): Promise<IDestination>;
  findByAccountIdWithFilters(
    accountId: string,
    method?: string,
    search?: string
  ): Promise<IDestination[] | null>;
  update(destinationId: string, data: any): Promise<IDestination | null>;
  delete(destinationId: string): Promise<number>;
  findById(id: string): Promise<IDestination | null>;
  findByAccountId(accountId: string): Promise<IDestination[] | null>;
}
