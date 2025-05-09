// original do serviço de processamento - revisar

import { SQSClient, SQSClientConfig } from "@aws-sdk/client-sqs";

export class SqsConfig {
  private readonly client: SQSClient;
  private readonly queueUrl: string;

  constructor(filaSqs: string) {
    const isLocal = process.env.NODE_ENV === "local";
    const config: SQSClientConfig = {
      region: process.env.AWS_REGION ?? "us-east-1",
      endpoint: isLocal ? "http://localstack:4566" : "https://sqs.us-east-1.amazonaws.com", // Endpoint do LocalStack
      credentials: isLocal
        ? { accessKeyId: "test", secretAccessKey: "test" } // Credenciais fictícias
        : {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
            sessionToken: process.env.AWS_SESSION_TOKEN  // This is the additional parameter needed
          },
    };
    this.client = new SQSClient(config);
    this.queueUrl =
      process.env.SQS_QUEUE_URL ??
      (isLocal
        ? `http://localhost:4566/000000000000/${filaSqs}`
        : `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/${filaSqs}` );
  }

  getClient(): SQSClient {
    return this.client;
  }

  getQueueUrl(): string {
    return this.queueUrl;
  }
}
