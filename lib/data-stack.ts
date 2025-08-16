import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import {
  USER_TABLE_NAME,
  USER_TABLE_REGION,
  USER_TABLE_BILLING_MODE,
  USER_TABLE_REMOVAL_POLICY,
  USER_TABLE_STREAM_VIEW,
  USER_EMAIL_INDEX_NAME,
  USER_USERNAME_INDEX_NAME,
} from "../models/user/constants";

export class DataStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Users table with meaningful logical ID
    const usersTable = new dynamodb.Table(this, "UsersTable", {
      tableName: USER_TABLE_NAME,
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode:
        USER_TABLE_BILLING_MODE === "PAY_PER_REQUEST"
          ? dynamodb.BillingMode.PAY_PER_REQUEST
          : dynamodb.BillingMode.PROVISIONED,
      removalPolicy:
        USER_TABLE_REMOVAL_POLICY === "DESTROY"
          ? cdk.RemovalPolicy.DESTROY
          : cdk.RemovalPolicy.RETAIN,

      // Define the table structure and attributes
      stream:
        USER_TABLE_STREAM_VIEW === "NEW_AND_OLD_IMAGES"
          ? dynamodb.StreamViewType.NEW_AND_OLD_IMAGES
          : dynamodb.StreamViewType.NEW_IMAGE,

      // Define attribute definitions for GSIs
      sortKey: { name: "createdAt", type: dynamodb.AttributeType.STRING },
    });

    // Add GSI for email lookups (unique constraint)
    // This allows efficient queries by email
    usersTable.addGlobalSecondaryIndex({
      indexName: USER_EMAIL_INDEX_NAME,
      partitionKey: { name: "email", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "id", type: dynamodb.AttributeType.STRING }, // Add sort key for uniqueness
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Add GSI for username lookups (unique constraint)
    // This allows efficient queries by username
    usersTable.addGlobalSecondaryIndex({
      indexName: USER_USERNAME_INDEX_NAME,
      partitionKey: { name: "username", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "id", type: dynamodb.AttributeType.STRING }, // Add sort key for uniqueness
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Output table name and ARN for reference
    new cdk.CfnOutput(this, "UsersTableName", {
      value: usersTable.tableName,
      description: "Users table name",
    });

    new cdk.CfnOutput(this, "UsersTableArn", {
      value: usersTable.tableArn,
      description: "Users table ARN",
    });
  }
}
