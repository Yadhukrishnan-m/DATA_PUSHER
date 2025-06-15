import { IDestination } from "../models/destination.model"; 
export interface IDestinationService {
  createDestination(
    accountId: string,
    userId: string,
    data: {
      url: string;
      httpMethod: "POST" | "PUT" | "PATCH" | "GET" | "DELETE";
      headers: object;
    }
  ): Promise<IDestination>;
  getByAccountIdWithFilter({
    accountId,
    userId,
    method,
    search,
  }: {
    accountId: string;
    userId: string;
    method?: string;
    search?: string;
  }): Promise<IDestination[]>;
  updateDestination(
    accountId: string,
    userId: string,
    destinationId: string,
    data: any
  ): Promise<IDestination>;
  deleteDestination(
    accountId: string,
    userId: string,
    destinationId: string
  ): Promise<void>;
}
