import { ErrorReadMsgGatewayInterface } from "../../Core/Interfaces/Gateway/ErrorReadMsgGatewayInterface";
import { IDbConnection } from "../../Core/Interfaces/IDbConnection";
import { ErrorMsgDTO } from "../../Core/Types/DTO/ErrorMsgDTO";
import { ProcessingUseCases } from "../../Core/Usecase/ProcessingUseCases";

export class ErrorQueueHandler {
  constructor(
    private readonly dbConnection: IDbConnection,
    private readonly queueService: ErrorReadMsgGatewayInterface
  ) {}

  async handle(): Promise<void> {
    const errorDTO: ErrorMsgDTO | undefined =
      await this.queueService.getNextErrorMessage();
    if (errorDTO) {
      try {
        console.log("Mensagem de erro recebida:", errorDTO);
        const processingGateway = this.dbConnection.gateways.processingRepoGateway;
        const processingStatusUpdated = await ProcessingUseCases.RegisterProcessingError(processingGateway, errorDTO);
        if (!processingStatusUpdated) {
            throw new Error("Error processing error message");
        }
      }
      catch (error: any) {
        throw new Error(error.message);
      }
    } else {
      console.log("Nenhum vídeo na fila de processamento no momento.");
    }
  }


}
