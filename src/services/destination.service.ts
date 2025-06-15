import { DestinationRepository } from "../repositories/destination.repository";
import {  IDestination } from "../models/destination.model";
import { CustomError } from "../utils/CustomError";
import { MESSAGES } from "../config/constants/messages"; 
import { STATUS_CODES } from "../config/constants/status-code"
import { IDestinationService } from "../interfaces/destination.service.interface";
import { AccountMemberRepository } from "../repositories/accountMember.repository";
import { error } from "console";
import { IDestinationRepository } from "../interfaces/destination.repository.interface";

interface FilterOptions {
    accountId: string;
    userId: string;
    method?: string;
    search?: string;
  }

export class DestinationService implements IDestinationService {
  constructor(
    private _destinationRepo: IDestinationRepository,
    private _memberRepo: AccountMemberRepository
  ) {}

  async createDestination(
    accountId: string,
    userId: string,
    data: {
      url: string;
      httpMethod: "POST" | "PUT" | "PATCH" | "GET";
      headers: object;
    }
  ): Promise<IDestination> {
    const isAdmin = await this._memberRepo.isUserAdmin(accountId, userId);
   

    if (!isAdmin) {
      throw new CustomError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    }
    const newDestination = await this._destinationRepo.create({
      accountId: accountId,
      url: data.url,
      httpMethod: data.httpMethod,
      headers: data.headers,
      createdBy: userId,
      updatedBy: userId,
    });
    return newDestination;
  }

  async getByAccountIdWithFilter({
    accountId,
    userId,
    method,
    search,
  }: FilterOptions): Promise<IDestination[]> {
    const isMember = await this._memberRepo.isMember(userId, accountId);
 

    if (!isMember) {
      throw new CustomError(MESSAGES.NOT_A_MEMBER, STATUS_CODES.UNAUTHORIZED);
    }

    const destinatiions =
      await this._destinationRepo.findByAccountIdWithFilters(
        accountId,
        method,
        search
      );
    if (!destinatiions) {
      throw new CustomError(
        MESSAGES.DESTINATION_NOT_FOUND,
        STATUS_CODES.NOT_FOUND
      );
    }
    return destinatiions;
  }

  async updateDestination(
    accountId: string,
    userId: string,
    destinationId: string,
    data: any
  ) :Promise<IDestination>{
    const member = await this._memberRepo.isMember(
        userId,
      accountId  
    );    
    if (!member) {
      throw new CustomError(MESSAGES.NOT_A_MEMBER, STATUS_CODES.UNAUTHORIZED);
    }
    const destinations = await this._destinationRepo.findById(destinationId);
    if (!destinations || destinations.accountId !== accountId) {
      throw new CustomError(
        MESSAGES.DESTINATION_NOT_IN_ACCOUNT,
        STATUS_CODES.NOT_FOUND
      );
    }
    const destination= await this._destinationRepo.update(destinationId, data);
    if (!destination) {
        throw new CustomError(MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
    }
    return destination
  }

  async deleteDestination(
    accountId: string,
    userId: string,
    destinationId: string
  ):Promise<void> {

    const admin = await this._memberRepo.isUserAdmin(
      accountId,
      userId
    );
    
    if (!admin) {
      throw new CustomError(MESSAGES.NOT_AN_ADMIN, STATUS_CODES.UNAUTHORIZED);
    }
    const destination = await this._destinationRepo.findById(destinationId);
    if (!destination || destination.accountId !== accountId) {
      throw new CustomError(
        MESSAGES.DESTINATION_NOT_IN_ACCOUNT,
        STATUS_CODES.NOT_FOUND
      );
    }
     await this._destinationRepo.delete(destinationId);
  }
}
