import { SNSClient } from "@aws-sdk/client-sns";
import { SnsConfig } from "../../../src/Infrastructure/Configs/SnsConfig";

describe("SnsConfig", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules(); // Clears the cache
    process.env = { ...originalEnv }; // Make a copy
  });

  afterAll(() => {
    process.env = originalEnv; // Restore original environment
  });

  it("should configure SNS client for local environment", () => {
    process.env.NODE_ENV = "local";
    process.env.AWS_REGION = "us-east-1";
    // No need to set AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY for local

    const snsConfig = new SnsConfig();
    const client = snsConfig.getClient();
    const topicArn = snsConfig.getTopicArn();

    expect(client).toBeInstanceOf(SNSClient);
    // Check client configuration (accessing private config is tricky, focus on behavior)
    // We can infer config from the constructor logic based on env vars
    expect(topicArn).toBe(
      "arn:aws:sns:us-east-1:000000000000:canal-de-processamento"
    );
    // Further checks could involve mocking the SNSClient constructor if needed
    // to verify endpoint and credentials, but that might be overly complex.
  });

  it("should configure SNS client for non-local environment", () => {
    process.env.NODE_ENV = "production";
    process.env.AWS_REGION = "eu-west-1";
    process.env.AWS_ACCESS_KEY_ID = "prod_key_id";
    process.env.AWS_SECRET_ACCESS_KEY = "prod_secret_key";
    process.env.SNS_TOPIC_ARN = "arn:aws:sns:eu-west-1:PROD_ACCOUNT:prod-topic";

    const snsConfig = new SnsConfig();
    const client = snsConfig.getClient();
    const topicArn = snsConfig.getTopicArn();

    expect(client).toBeInstanceOf(SNSClient);
    expect(topicArn).toBe("arn:aws:sns:eu-west-1:PROD_ACCOUNT:prod-topic");
    // Again, verifying exact client config like region/credentials directly is hard
    // without deeper mocking or exposing config. We trust the constructor logic.
  });

  it("should use default values when environment variables are not set (non-local)", () => {
    process.env.NODE_ENV = "production";
    // Unset specific env vars
    delete process.env.AWS_REGION;
    delete process.env.AWS_ACCESS_KEY_ID;
    delete process.env.AWS_SECRET_ACCESS_KEY;
    delete process.env.SNS_TOPIC_ARN;

    const snsConfig = new SnsConfig();
    const client = snsConfig.getClient();
    const topicArn = snsConfig.getTopicArn();

    expect(client).toBeInstanceOf(SNSClient);
    // Check default topic ARN for non-local when SNS_TOPIC_ARN is not set
    expect(topicArn).toBe(
      "arn:aws:sns:us-east-1:ACCOUNT_ID:canal-de-processamento"
    );
    // Default region should be us-east-1
    // Default credentials should be empty strings
  });

  it("should use default values when environment variables are not set (local)", () => {
    process.env.NODE_ENV = "local";
    // Unset specific env vars
    delete process.env.AWS_REGION;
    delete process.env.SNS_TOPIC_ARN;

    const snsConfig = new SnsConfig();
    const client = snsConfig.getClient();
    const topicArn = snsConfig.getTopicArn();

    expect(client).toBeInstanceOf(SNSClient);
    // Check default topic ARN for local when SNS_TOPIC_ARN is not set
    expect(topicArn).toBe(
      "arn:aws:sns:us-east-1:000000000000:canal-de-processamento"
    );
    // Default region should be us-east-1
    // Default credentials should be 'test'/'test'
  });

  it("getClient() should return the SNSClient instance", () => {
    process.env.NODE_ENV = "local";
    const snsConfig = new SnsConfig();
    const client = snsConfig.getClient();
    expect(client).toBeInstanceOf(SNSClient);
  });

  it("getTopicArn() should return the correct topic ARN string", () => {
    process.env.NODE_ENV = "production";
    process.env.SNS_TOPIC_ARN = "arn:custom:topic";
    const snsConfig = new SnsConfig();
    const topicArn = snsConfig.getTopicArn();
    expect(topicArn).toBe("arn:custom:topic");
  });
});