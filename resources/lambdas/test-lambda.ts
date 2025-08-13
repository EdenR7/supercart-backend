import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log("context", context);
  console.log("event", event);
  return {
    body: "Hello, World!",
    statusCode: 200,
  };
};
