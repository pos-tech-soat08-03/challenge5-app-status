import { ProcessingEntity } from "../../Core/Entity/ProcessingEntity";
import { EmailServiceInterface } from "../../Core/Interfaces/Gateway/EmailServiceInterface";
import { ProcessingPostMsgGatewayInterface } from "../../Core/Interfaces/Gateway/ProcessingPostMsgGatewayInterface";
import { ProcessingReadMsgGatewayInterface } from "../../Core/Interfaces/Gateway/ProcessingReadMsgGatewayInterface";
import { StatusReadMsgGatewayInterface } from "../../Core/Interfaces/Gateway/StatusReadMsgGatewayInterface";
import { IDbConnection } from "../../Core/Interfaces/IDbConnection";
import { ProcessingDTO } from "../../Core/Types/DTO/ProcessingDTO";
import { StatusMsgDTO } from "../../Core/Types/DTO/StatusMsgDTO";
import { ProcessingUseCases } from "../../Core/Usecase/ProcessingUseCases";

export class StatusQueueHandler {
  constructor(
    private readonly dbConnection: IDbConnection,
    private readonly queueService: StatusReadMsgGatewayInterface,
  ) {}

  async handle(): Promise<void> {
    const statusDTO: StatusMsgDTO | undefined =
      await this.queueService.getNextStatusMessage();
    if (statusDTO) {
      try {
        console.log("Mensagem de status recebida:", statusDTO);
        const processingGateway = this.dbConnection.gateways.processingRepoGateway;
        const processingStatusUpdated = await ProcessingUseCases.RegisterProcessingStatus(processingGateway, statusDTO);
        if (!processingStatusUpdated) {
            throw new Error("No processing status updated");
        }
      }
      catch (error: any) {
        throw new Error(error.message);
      }
    } else {
      console.log("Nenhuma mensagem de status no momento.");
    }
  }


}
