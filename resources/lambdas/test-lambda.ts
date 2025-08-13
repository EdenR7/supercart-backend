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
    body: "Good Evening, World!",
    statusCode: 200,
  };
};
