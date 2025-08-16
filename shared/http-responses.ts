import { APIGatewayProxyResult } from "aws-lambda";

/**
 * Creates standardized error responses for API Gateway
 * @param statusCode - HTTP status code (default: 500)
 * @param message - Error message (default: "Internal server error")
 * @returns APIGatewayProxyResult with error format: { success: false, message: string }
 */
export function errorResponse(
  statusCode: number = 500,
  message: string = "Internal server error"
): APIGatewayProxyResult {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      success: false,
      message,
    }),
  };
}

/**
 * Creates standardized success responses for API Gateway
 * @param statusCode - HTTP status code (default: 200)
 * @param message - Success message (default: "Success")
 * @param data - Optional data payload
 * @returns APIGatewayProxyResult with success format: { success: true, message: string, data?: any }
 */
export function successResponse(
  statusCode: number = 200,
  message: string = "Success",
  data?: any
): APIGatewayProxyResult {
  const response: any = {
    success: true,
    message,
  };

  if (data) {
    response.data = data;
  }

  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(response),
  };
}
