// original do serviço de processamento - revisar

import { SNSClient, SNSClientConfig } from "@aws-sdk/client-sns";

export class SnsConfig {
  private readonly client: SNSClient;
  private readonly topicArn: string;

  constructor() {
    console.log(`NODE_ENV é: ${process.env.NODE_ENV} :na configução SNS`); // Log para verificar o valor de NODE_ENV
    const isLocal = process.env.NODE_ENV?.trim() === "local"; // Certifique-se de que o valor é comparado corretamente
    const config: SNSClientConfig = {
      region: process.env.AWS_REGION ?? "us-east-1",
      endpoint: isLocal ? "http://localstack:4566" : `https://sns.${process.env.AWS_REGION}.amazonaws.com`,
      credentials: isLocal
        ? { accessKeyId: "test", secretAccessKey: "test" }
        : {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
          },
    };
    this.client = new SNSClient(config);
    this.topicArn =
      process.env.SNS_TOPIC_ARN ??
      (isLocal
        ? "arn:aws:sns:us-east-1:000000000000:sns-canal-de-processamento"
        : `arn:aws:sns:us-east-1:${process.env.AWS_ACCOUNT_ID}:sns-canal-de-processamento`);
  }

  getClient(): SNSClient {
    return this.client;
  }

  getTopicArn(): string {
    return this.topicArn;
  }
}
