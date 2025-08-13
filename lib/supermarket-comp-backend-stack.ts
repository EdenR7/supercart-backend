import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import path from "path";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SupermarketCompBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const testLambda = new NodejsFunction(this, "TestLambda", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "test-lambda.handler",
      entry: path.join(__dirname, "../resources/lambdas/test-lambda.ts"),
    });

    const api = new apigateway.RestApi(this, "TestApi", {
      restApiName: "TestApi",
    });

    const testLambdaIntegration = new apigateway.LambdaIntegration(testLambda);

    const testResource = api.root.addResource("test");
    testResource.addMethod("GET", testLambdaIntegration);
  }
}
