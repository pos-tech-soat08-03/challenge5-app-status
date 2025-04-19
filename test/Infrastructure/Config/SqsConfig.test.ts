import { SQSClient } from "@aws-sdk/client-sqs";
import { SqsConfig } from "../../../src/Infrastructure/Configs/SqsConfig";

// Mock the SQSClient constructor
jest.mock("@aws-sdk/client-sqs", () => {
  return {
    SQSClient: jest.fn().mockImplementation(() => ({
      // Mock any methods needed by SqsConfig if necessary
    })),
  };
});

describe("SqsConfig", () => {
  const OLD_ENV = process.env;
  const mockQueueName = "test-queue";

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it("should configure SQSClient for local environment", () => {
    process.env.NODE_ENV = "local";
    process.env.AWS_REGION = "us-east-1"; // Default region

    const sqsConfig = new SqsConfig(mockQueueName);
    const client = sqsConfig.getClient();
    const queueUrl = sqsConfig.getQueueUrl();

    expect(SQSClient).toHaveBeenCalledWith({
      region: "us-east-1",
      endpoint: "http://localstack:4566",
      credentials: { accessKeyId: "test", secretAccessKey: "test" },
    });
    expect(client).toBeDefined();
    expect(queueUrl).toBe(`http://localstack:4566/000000000000/${mockQueueName}`);
  });

  it("should configure SQSClient for production environment with env variables", () => {
    delete process.env.NODE_ENV; // Not local
    process.env.AWS_REGION = "eu-west-1";
    process.env.AWS_ACCESS_KEY_ID = "prod-key-id";
    process.env.AWS_SECRET_ACCESS_KEY = "prod-secret-key";
    process.env.SQS_QUEUE_URL = "https://sqs.eu-west-1.amazonaws.com/123456789012/prod-queue";

    const sqsConfig = new SqsConfig("prod-queue"); // Queue name might be different in prod
    const client = sqsConfig.getClient();
    const queueUrl = sqsConfig.getQueueUrl();

    expect(SQSClient).toHaveBeenCalledWith({
      region: "eu-west-1",
      endpoint: undefined,
      credentials: {
        accessKeyId: "prod-key-id",
        secretAccessKey: "prod-secret-key",
      },
    });
    expect(client).toBeDefined();
    expect(queueUrl).toBe("https://sqs.eu-west-1.amazonaws.com/123456789012/prod-queue");
  });

  it("should configure SQSClient for production environment with defaults if env variables are missing", () => {
    delete process.env.NODE_ENV;
    delete process.env.AWS_ACCESS_KEY_ID;
    delete process.env.AWS_SECRET_ACCESS_KEY;
    delete process.env.SQS_QUEUE_URL;
    process.env.AWS_REGION = "us-east-1"; // Default region

    const sqsConfig = new SqsConfig(mockQueueName);
    const client = sqsConfig.getClient();
    const queueUrl = sqsConfig.getQueueUrl();

    expect(SQSClient).toHaveBeenCalledWith({
      region: "us-east-1",
      endpoint: undefined,
      credentials: {
        accessKeyId: "",
        secretAccessKey: "",
      },
    });
    expect(client).toBeDefined();
    // Note: This default URL structure might need adjustment based on actual AWS behavior/requirements
    expect(queueUrl).toBe(`https://sqs.us-east-1.amazonaws.com/SEU_ACCOUNT_ID/${mockQueueName}`);
  });

  it("should return the configured client via getClient", () => {
    process.env.NODE_ENV = "local";
    const sqsConfig = new SqsConfig(mockQueueName);
    const client = sqsConfig.getClient();
    expect(client).toBeInstanceOf(Object); // SQSClient is mocked, so we check for an object
    expect(SQSClient).toHaveBeenCalledTimes(1);
  });

  it("should return the configured queue URL via getQueueUrl", () => {
    process.env.NODE_ENV = "local";
    const sqsConfig = new SqsConfig(mockQueueName);
    const queueUrl = sqsConfig.getQueueUrl();
    expect(queueUrl).toBe(`http://localstack:4566/000000000000/${mockQueueName}`);
  });
});