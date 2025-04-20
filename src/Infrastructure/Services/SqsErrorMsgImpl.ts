import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";

import { SqsConfig } from "../Configs/SqsConfig";
import { ErrorReadMsgGatewayInterface } from "../../Core/Interfaces/Gateway/ErrorReadMsgGatewayInterface";
import { ErrorMsgDTO } from "../../Core/Types/DTO/ErrorMsgDTO";

export class SqsErrorMsgImpl implements ErrorReadMsgGatewayInterface {
  constructor(private readonly sqsConfig: SqsConfig) {}

  async getNextErrorMessage(): Promise <ErrorMsgDTO | undefined> {
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
    const snsEnvelope = JSON.parse(message.Body ?? "{}");
    const bodyToDTO = JSON.parse(snsEnvelope.Message ?? "{}") as ErrorMsgDTO;

    const delCommand = new DeleteMessageCommand({
      QueueUrl: this.sqsConfig.getQueueUrl(),
      ReceiptHandle: message.ReceiptHandle,
    });
    await this.sqsConfig.getClient().send(delCommand);

    return bodyToDTO;
  }	

}
