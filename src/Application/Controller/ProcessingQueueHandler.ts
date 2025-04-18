import { ProcessingEntity } from "../../Core/Entity/ProcessingEntity";
import { ProcessingReadMsgGatewayInterface } from "../../Core/Interfaces/Gateway/ProcessingReadMsgGatewayInterface";
import { IDbConnection } from "../../Core/Interfaces/IDbConnection";
import { ProcessingDTO } from "../../Core/Types/DTO/ProcessingDTO";
import { ProcessingUseCases } from "../../Core/Usecase/ProcessingUseCases";

export class ProcessingQueueHandler {
  constructor(
    private readonly dbConnection: IDbConnection,
    private readonly queueService: ProcessingReadMsgGatewayInterface
  ) {}

  async handle(): Promise<void> {
    const processingData: ProcessingDTO | undefined =
      await this.queueService.getNextProcessingMessage();
    if (processingData) {
      try {
        console.log("Mensagem de processamento recebida:", processingData);
        const processingGateway = this.dbConnection.gateways.processingRepoGateway;
        const processingCreated = await ProcessingUseCases.CreateProcessing(processingGateway, processingData.video, processingData.user, processingData.config);
        if (!processingCreated) {
            throw new Error("No processing created");
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
