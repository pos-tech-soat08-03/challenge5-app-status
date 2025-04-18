import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";

import { SqsConfig } from "../Configs/SqsConfig";
import { ErrorReadMsgGatewayInterface } from "../../Core/Interfaces/Gateway/ErrorReadMsgGatewayInterface";
import { ProcessingStatusEnum } from "../../Core/Entity/Enum/ProcessingStatusEnum";
import { ErrorMsgValueObject } from "../../Core/Entity/ValueObject/ErrorMsgValueObject";
import { ErrorMsgDTO } from "../../Core/Types/DTO/ErrorMsgDTO";

export class SqsErrorMsgImpl implements ErrorReadMsgGatewayInterface {
  constructor(private readonly sqsConfig: SqsConfig) {}

  async getNextErrorMessage(): Promise <ErrorMsgValueObject | undefined> {
    const command = new ReceiveMessageCommand({
      QueueUrl: this.sqsConfig.getQueueUrl(),
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 20,
    });

    const response = await this.sqsConfig.getClient().send(command);
    if (!response.Messages || response.Messages.length === 0) {
      return undefined;
    }

    const message = response.Messages[0];
    const bodyToDTO = JSON.parse(message.Body || "{}") as ErrorMsgDTO;
    return new ErrorMsgValueObject(
        bodyToDTO.id_video,
        bodyToDTO.id_user,
        bodyToDTO.status as ProcessingStatusEnum,
        bodyToDTO.status_time,
        bodyToDTO.error_message
    )
  }	

  async deleteErrorMessage (errorId: string): Promise <void> {
    const command = new DeleteMessageCommand({
      QueueUrl: this.sqsConfig.getQueueUrl(),
      ReceiptHandle: errorId,
    });

    await this.sqsConfig.getClient().send(command);
    console.log("Mensagem deletada da fila SQS:", errorId);
  }	
}
