import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";

import { SqsConfig } from "../Configs/SqsConfig";
import { StatusReadMsgGatewayInterface } from "../../Core/Interfaces/Gateway/StatusReadMsgGatewayInterface";
import { StatusMsgValueObject } from "../../Core/Entity/ValueObject/StatusMsgValueObject";
import { StatusMsgDTO } from "../../Core/Types/DTO/StatusMsgDTO";
import { ProcessingStatusEnum } from "../../Core/Entity/Enum/ProcessingStatusEnum";


export class SqsStatusMsgImpl implements StatusReadMsgGatewayInterface {
  constructor(private readonly sqsConfig: SqsConfig) {}

  async getNextStatusMessage(): Promise <StatusMsgValueObject | undefined> {
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
    const bodyToDTO = JSON.parse(message.Body || "{}") as StatusMsgDTO;

    const delCommand = new DeleteMessageCommand({
      QueueUrl: this.sqsConfig.getQueueUrl(),
      ReceiptHandle: message.ReceiptHandle,
    });
    await this.sqsConfig.getClient().send(delCommand);

    return new StatusMsgValueObject(
        bodyToDTO.id_video,
        bodyToDTO.id_usuario,
        bodyToDTO.status as ProcessingStatusEnum,
        bodyToDTO.status_time,
        bodyToDTO.percentage,
        bodyToDTO.message
    );
  }	

}
