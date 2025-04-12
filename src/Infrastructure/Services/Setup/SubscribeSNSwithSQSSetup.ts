import AWS from "aws-sdk";

// Interface for AWS configuration
export interface AWSConfig {
  region?: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  endpoint?: string;
}

export class SubscribeSNSwithSQSSetup {
  private readonly sns: AWS.SNS;
  private readonly sqs: AWS.SQS;

  constructor(config?: AWSConfig) {
    this.sns = new AWS.SNS(config);
    this.sqs = new AWS.SQS(config);
  }

  async setupSubscription(topicArn: string, queueName: string): Promise<void> {
    try {
      // Create SQS Queue
      const queue = await this.sqs.createQueue({ QueueName: queueName }).promise();
      const queueUrl = queue.QueueUrl;

      if (!queueUrl) {
        throw new Error("Failed to create SQS queue");
      }

      // Get Queue ARN
      const queueAttributes = await this.sqs
        .getQueueAttributes({
          QueueUrl: queueUrl,
          AttributeNames: ["QueueArn"],
        })
        .promise();

      const queueArn = queueAttributes.Attributes?.QueueArn;
      console.log("Queue ARN:", queueArn);

      if (!queueArn) {
        throw new Error("Failed to retrieve SQS queue ARN");
      }

      console.log("Topic ARN:", topicArn);

      // Subscribe SQS to SNS Topic
      await this.sns
        .subscribe({
          Protocol: "sqs",
          TopicArn: topicArn,
          Endpoint: queueArn,
        })
        .promise();

      // Allow SNS to send messages to SQS
      const policy = {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: "*",
            Action: "sqs:SendMessage",
            Resource: queueArn,
            Condition: {
              ArnEquals: {
                "aws:SourceArn": topicArn,
              },
            },
          },
        ],
      };

      await this.sqs
        .setQueueAttributes({
          QueueUrl: queueUrl,
          Attributes: {
            Policy: JSON.stringify(policy),
          },
        })
        .promise();

      console.log(`SQS queue ${queueName} subscribed to SNS topic ${topicArn}`);
    } catch (error) {
      console.error("Error setting up subscription:", error);
      throw error;
    }
  }
}