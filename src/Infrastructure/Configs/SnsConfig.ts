// original do serviço de processamento - revisar

import { SNSClient, SNSClientConfig } from "@aws-sdk/client-sns";

export class SnsConfig {
  private readonly client: SNSClient;
  private readonly topicArn: string;

  constructor() {
    console.log(`NODE_ENV é: ${process.env.NODE_ENV} :na configuração SNS`); // Log para verificar NODE_ENV

    const isLocal = process.env.NODE_ENV?.trim() === "local"; // Certifique-se de que o valor é comparado corretamente
    const config: SNSClientConfig = {
      region: process.env.AWS_REGION ?? "us-east-1",
      endpoint: isLocal ? "http://localstack:4566" : `https://sns.us-east-1.amazonaws.com`,
      credentials: isLocal
        ? { accessKeyId: "test", secretAccessKey: "test" }
        : {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
          },
    };
    this.client = new SNSClient(config);
    console.log(`SNS Client configurado com endpoint: ${config.endpoint}`); // Log para verificar o endpoint configurado
    this.topicArn =
      process.env.SNS_TOPIC_ARN ??
      (isLocal
        ? "arn:aws:sns:us-east-1:000000000000:sns-canal-de-processamento"
        : `arn:aws:sns:us-east-1:${process.env.AWS_ACCOUNT_ID}:sns-canal-de-processamento`);
    console.log(`SNS Topic ARN configurado: ${this.topicArn}`); // Log para verificar o ARN do tópico
  }

  getClient(): SNSClient {
    return this.client;
  }

  getTopicArn(): string {
    return this.topicArn;
  }
}
