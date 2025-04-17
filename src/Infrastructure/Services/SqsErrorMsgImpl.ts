// import {
//   ReceiveMessageCommand,
//   DeleteMessageCommand,
// } from "@aws-sdk/client-sqs";

// import { SqsConfig } from "../Configs/SqsConfig";


// export class SqsServiceImpl implements QueueServiceInterface {
//   constructor(private readonly sqsConfig: SqsConfig) {}

//   async receberProximaMensagem(): Promise<MessageVideoData | null> {
//     const command = new ReceiveMessageCommand({
//       QueueUrl: this.sqsConfig.getQueueUrl(),
//       MaxNumberOfMessages: 1,
//       WaitTimeSeconds: 20,
//     });

//     const response = await this.sqsConfig.getClient().send(command);
//     if (!response.Messages || response.Messages.length === 0) {
//       return null;
//     }

//     const message = response.Messages[0];
//     const body = JSON.parse(message.Body || "{}") as MessageVideoData;
//     return MessageVideoData.fromSqsMessage(body, message.ReceiptHandle);
//   }
//   async deletarMensagem(videoData: MessageVideoData): Promise<void> {
//     const command = new DeleteMessageCommand({
//       QueueUrl: this.sqsConfig.getQueueUrl(),
//       ReceiptHandle: videoData._receiptHandle,
//     });

//     await this.sqsConfig.getClient().send(command);
//     console.log("Mensagem deletada da fila SQS:", videoData._receiptHandle);
//   }
// }
