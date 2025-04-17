import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";

import { SqsConfig } from "../Configs/SqsConfig";
import { ProcessingReadMsgGatewayInterface } from "../../Core/Interfaces/Gateway/ProcessingReadMsgGatewayInterface";
import { ProcessingEntity } from "../../Core/Entity/ProcessingEntity";
import { ProcessingDTO } from "../../Core/Types/DTO/ProcessingDTO";


export class SqsProcessingMsgImpl implements ProcessingReadMsgGatewayInterface {
  constructor(private readonly sqsConfig: SqsConfig) {}

  async getNextProcessingMessage (): Promise <ProcessingEntity | undefined> {
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
    const bodyToDTO = JSON.parse(message.Body || "{}") as ProcessingDTO;
    return ProcessingEntity.fromDTO(bodyToDTO);
  }	

  async deleteProcessingMessage (processingId: string): Promise <void> {
    const command = new DeleteMessageCommand({
      QueueUrl: this.sqsConfig.getQueueUrl(),
      ReceiptHandle: processingId,
    });

    await this.sqsConfig.getClient().send(command);
    console.log("Mensagem deletada da fila SQS:", processingId);
  }	
}
