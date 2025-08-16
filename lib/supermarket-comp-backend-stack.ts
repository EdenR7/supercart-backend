import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import * as path from "path";

export class SupermarketCompBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Lambda functions with meaningful names
    const testLambda = new lambda.Function(this, "TestLambda", {
      functionName: "supercart-test-lambda", // Custom function name
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "../resources/lambdas")),
      environment: {
        NODE_ENV: "production",
      },
    });

    const createUserLambda = new lambda.Function(this, "CreateUserLambda", {
      functionName: "supercart-create-user-lambda", // Custom function name
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "user/create-user.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "../resources/lambdas")),
      environment: {
        NODE_ENV: "production",
        USER_TABLE_NAME: "supercart-users", // Reference the table name from constants
      },
    });

    const getUserLambda = new lambda.Function(this, "GetUserLambda", {
      functionName: "supercart-get-user-lambda", // Custom function name
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "user/get-user.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "../resources/lambdas")),
      environment: {
        NODE_ENV: "production",
        USER_TABLE_NAME: "supercart-users", // Reference the table name from constants
      },
    });

    // Create API Gateway with meaningful name
    const api = new apigateway.RestApi(this, "SupermarketCompAPI", {
      restApiName: "Supermarket Comparison API",
      description: "API for supermarket comparison backend services",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
      },
    });

    // Add resources and methods
    const testResource = api.root.addResource("test");
    testResource.addMethod("GET", new apigateway.LambdaIntegration(testLambda));

    const usersResource = api.root.addResource("users");
    usersResource.addMethod(
      "POST",
      new apigateway.LambdaIntegration(createUserLambda)
    );

    const userByIdResource = usersResource.addResource("{id}");
    userByIdResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getUserLambda)
    );

    // Output the API Gateway URL
    new cdk.CfnOutput(this, "ApiGatewayUrl", {
      value: api.url,
      description: "API Gateway URL",
    });
  }
}
