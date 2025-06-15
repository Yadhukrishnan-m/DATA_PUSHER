export interface IDataHandlerService {
  processIncomingData(
    token: string,
    eventId: string,
    payload: any
  ): Promise<boolean>;
}
