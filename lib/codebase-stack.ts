import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { LambdaService } from "./lambda-service";

export class CodebaseStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create lambda service - this defines all lambdas
    const lambdaService = new LambdaService(this, "LambdaService");

    // Get lambdas from the service
    const testLambda = lambdaService.functions.testLambda;
    const createUserLambda = lambdaService.functions.createUserLambda;
    const getUserLambda = lambdaService.functions.getUserLambda;

    // DynamoDB policy statement for all tables
    const dynamoAllTablesRW = new iam.PolicyStatement({
      actions: [
        "dynamodb:GetItem",
        "dynamodb:BatchGetItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:BatchWriteItem",
        "dynamodb:DescribeTable",
      ],
      resources: [
        `arn:aws:dynamodb:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:table/*`,
        `arn:aws:dynamodb:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:table/*/index/*`,
      ],
    });

    // Attach to each Lambda
    for (const fn of Object.values(lambdaService.functions)) {
      fn.addToRolePolicy(dynamoAllTablesRW);
    }

    // API Gateway
    const api = new apigateway.RestApi(this, "SupermarketCompAPI", {
      restApiName: "Supermarket Comparison API",
      description: "API for supermarket comparison backend",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
      },
    });

    // Test endpoint
    const testIntegration = new apigateway.LambdaIntegration(testLambda);
    api.root.addMethod("GET", testIntegration);

    // User endpoints
    const users = api.root.addResource("users");
    const createUserIntegration = new apigateway.LambdaIntegration(
      createUserLambda
    );
    users.addMethod("POST", createUserIntegration);

    const getUserIntegration = new apigateway.LambdaIntegration(getUserLambda);
    const userById = users.addResource("{id}");
    userById.addMethod("GET", getUserIntegration);

    // Output the API URL
    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.url,
      description: "API Gateway URL",
    });
  }
}
