import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import path from "path";

/**
 * Lambda service that centrally defines all lambda functions with their configurations
 * Uses factory functions to create lambdas for specific trigger types: SQS, API Gateway, Cron, and DynamoDB
 */
export class LambdaService extends Construct {
  public functions: { [key: string]: NodejsFunction } = {};

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Define all lambdas using factory functions
    this.createAllLambdas();
  }
  /**
   * Creates all lambda functions using factory functions
   */
  createAllLambdas(): void {
    // API Gateway triggered lambdas
    this.functions.testLambda = this.#createApiGatewayLambda(
      "TestLambda",
      "../resources/lambdas/test-lambda.ts",
      "Test lambda function triggered via API Gateway"
    );

    this.functions.createUserLambda = this.#createApiGatewayLambda(
      "CreateUserLambda",
      "../resources/lambdas/user/create-user.ts",
      "Lambda function for creating new users via API Gateway"
    );

    this.functions.getUserLambda = this.#createApiGatewayLambda(
      "GetUserLambda",
      "../resources/lambdas/user/get-user.ts",
      "Lambda function for retrieving user information by id via API Gateway"
    );

    // Example of how to add more lambdas easily:
    // this.functions.getUserLambda = this.#createApiGatewayLambda(
    //   "GetUserLambda",
    //   "../resources/lambdas/user/get-user.ts",
    //   "Lambda function for retrieving user information via API Gateway"
    // );

    // SQS triggered lambdas
    // this.functions.userNotificationLambda = this.#createSqsLambda(
    //   "UserNotificationLambda",
    //   "../resources/lambdas/notifications/user-notification.ts",
    //   "Lambda function triggered by SQS for sending user notifications"
    // );

    // this.functions.dataProcessingLambda = this.#createSqsLambda(
    //   "DataProcessingLambda",
    //   "../resources/lambdas/data/processor.ts",
    //   "Lambda function triggered by SQS for processing data"
    // );

    // Cron/scheduled lambdas
    // this.functions.cleanupLambda = this.#createCronLambda(
    //   "CleanupLambda",
    //   "../resources/lambdas/scheduled/cleanup.ts",
    //   "Lambda function scheduled to run periodically for cleanup tasks"
    // );

    // this.functions.reportGeneratorLambda = this.#createCronLambda(
    //   "ReportGeneratorLambda",
    //   "../resources/lambdas/scheduled/report-generator.ts",
    //   "Lambda function scheduled to generate reports periodically"
    // );

    // DynamoDB triggered lambdas
    // this.functions.userAuditLambda = this.#createDynamoDbLambda(
    //   "UserAuditLambda",
    //   "../resources/lambdas/triggers/user-audit.ts",
    //   "Lambda function triggered by DynamoDB stream changes for user audit logging"
    // );

    // this.functions.cacheUpdateLambda = this.#createDynamoDbLambda(
    //   "CacheUpdateLambda",
    //   "../resources/lambdas/triggers/cache-update.ts",
    //   "Lambda function triggered by DynamoDB stream changes for cache updates"
    // );
  }

  /**
   * Gets all lambda functions
   * @returns Object containing all lambda functions
   */
  getFunctions(): { [key: string]: NodejsFunction } {
    return this.functions;
  }

  /**
   * Gets a specific lambda function by name
   * @param name - Name of the lambda function
   * @returns The lambda function or undefined if not found
   */
  getFunction(name: string): NodejsFunction | undefined {
    return this.functions[name];
  }

  /**
   * Factory function for creating API Gateway triggered lambda functions
   * @param functionName - Name of the lambda function
   * @param entryPath - Path to the lambda entry file
   * @param description - Description of the lambda function
   * @returns Configured NodejsFunction for API Gateway
   */
  #createApiGatewayLambda(
    functionName: string,
    entryPath: string,
    description: string
  ): NodejsFunction {
    return new NodejsFunction(this, functionName, {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "handler",
      entry: path.join(__dirname, entryPath),
      timeout: cdk.Duration.seconds(29), // API Gateway limit is 30s
      memorySize: 512,
      functionName: functionName, // This gives the lambda a clean name
      bundling: {
        minify: true,
        sourceMap: false,
        target: "es2020",
      },
      description,
    });
  }

  /**
   * Factory function for creating SQS triggered lambda functions
   * @param functionName - Name of the lambda function
   * @param entryPath - Path to the lambda entry file
   * @param description - Description of the lambda function
   * @returns Configured NodejsFunction for SQS triggers
   */
  #createSqsLambda(
    functionName: string,
    entryPath: string,
    description: string
  ): NodejsFunction {
    return new NodejsFunction(this, functionName, {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "handler",
      entry: path.join(__dirname, entryPath),
      timeout: cdk.Duration.minutes(5), // SQS can handle longer timeouts
      memorySize: 1024, // Higher memory for processing queue messages
      functionName: functionName, // This gives the lambda a clean name
      bundling: {
        minify: true,
        sourceMap: false,
        target: "es2020",
      },
      description,
    });
  }

  /**
   * Factory function for creating Cron/scheduled lambda functions
   * @param functionName - Name of the lambda function
   * @param entryPath - Path to the lambda entry file
   * @param description - Description of the lambda function
   * @returns Configured NodejsFunction for scheduled execution
   */
  #createCronLambda(
    functionName: string,
    entryPath: string,
    description: string
  ): NodejsFunction {
    return new NodejsFunction(this, functionName, {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "handler",
      entry: path.join(__dirname, entryPath),
      timeout: cdk.Duration.minutes(15), // Longer timeout for scheduled tasks
      memorySize: 512,
      functionName: functionName, // This gives the lambda a clean name
      bundling: {
        minify: true,
        sourceMap: false,
        target: "es2020",
      },
      description,
    });
  }

  /**
   * Factory function for creating DynamoDB triggered lambda functions
   * @param functionName - Name of the lambda function
   * @param entryPath - Path to the lambda entry file
   * @param description - Description of the lambda function
   * @returns Configured NodejsFunction for DynamoDB triggers
   */
  #createDynamoDbLambda(
    functionName: string,
    entryPath: string,
    description: string
  ): NodejsFunction {
    return new NodejsFunction(this, functionName, {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "handler",
      entry: path.join(__dirname, entryPath),
      timeout: cdk.Duration.minutes(5), // DynamoDB streams can handle longer timeouts
      memorySize: 1024, // Higher memory for processing stream events
      functionName: functionName, // This gives the lambda a clean name
      bundling: {
        minify: true,
        sourceMap: false,
        target: "es2020",
      },
      description,
    });
  }
}
