// original do serviço de processamento - revisar

import { SNSClient, SNSClientConfig } from "@aws-sdk/client-sns";

export class SnsConfig {
  private readonly client: SNSClient;
  private readonly topicArn: string;

  constructor() {
    const isLocal = process.env.NODE_ENV === "local";
    const config: SNSClientConfig = {
      region: process.env.AWS_REGION ?? "us-east-1",
      endpoint: isLocal ? "http://localstack:4566" : undefined,
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
        ? "arn:aws:sns:us-east-1:000000000000:canal-de-processamento"
        : "arn:aws:sns:us-east-1:ACCOUNT_ID:canal-de-processamento");
  }

  getClient(): SNSClient {
    return this.client;
  }

  getTopicArn(): string {
    return this.topicArn;
  }
}
