import { ProcessingEntity } from "../../Core/Entity/ProcessingEntity";
import { VideoValueObject } from "../../Core/Entity/ValueObject/VideoValueObject";
import { EmailServiceInterface } from "../../Core/Interfaces/Gateway/EmailServiceInterface";
import { ErrorReadMsgGatewayInterface } from "../../Core/Interfaces/Gateway/ErrorReadMsgGatewayInterface";
import { ProcessingPostMsgGatewayInterface } from "../../Core/Interfaces/Gateway/ProcessingPostMsgGatewayInterface";
import { IDbConnection } from "../../Core/Interfaces/IDbConnection";
import { ErrorMsgDTO } from "../../Core/Types/DTO/ErrorMsgDTO";
import { ProcessingUseCases } from "../../Core/Usecase/ProcessingUseCases";

export class ErrorQueueHandler {
  constructor(
    private readonly dbConnection: IDbConnection,
    private readonly queueService: ErrorReadMsgGatewayInterface,
    private readonly notificationGateway: ProcessingPostMsgGatewayInterface,
    private readonly emailAlert: EmailServiceInterface
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

        if (processingStatusUpdated.success === false) {
          this.emailAlert.sendEmail(
            processingStatusUpdated.user?.email || "",
            "Erro no processamento",
            `Ocorreu um erro no processamento do vídeo ${processingStatusUpdated.video?.title}. Detalhes: ${processingStatusUpdated.error_message}`
          )
          return;
        }
          
        // envia para reprocessamento
        this.notificationGateway.sendProcessingMessage(ProcessingEntity.fromResponse(processingStatusUpdated));
        
      }
      catch (error: any) {
        throw new Error(error.message);
      }
    } else {
      console.log("Nenhuma mensagem de erro no momento.");
    }
  }


}
