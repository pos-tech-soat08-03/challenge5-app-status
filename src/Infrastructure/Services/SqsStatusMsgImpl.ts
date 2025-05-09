import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";

import { SqsConfig } from "../Configs/SqsConfig";
import { StatusReadMsgGatewayInterface } from "../../Core/Interfaces/Gateway/StatusReadMsgGatewayInterface";
import { StatusMsgDTO } from "../../Core/Types/DTO/StatusMsgDTO";

export class SqsStatusMsgImpl implements StatusReadMsgGatewayInterface {
  constructor(private readonly sqsConfig: SqsConfig) {}

  async getNextStatusMessage(): Promise <StatusMsgDTO | undefined> {
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
    console.log("Mensagem de status recebida: ", snsEnvelope);
    const bodyToDTO = JSON.parse(snsEnvelope.Message ?? "{}") as StatusMsgDTO;

    const delCommand = new DeleteMessageCommand({
      QueueUrl: this.sqsConfig.getQueueUrl(),
      ReceiptHandle: message.ReceiptHandle,
    });
    await this.sqsConfig.getClient().send(delCommand);

    return bodyToDTO;
  }	

}
