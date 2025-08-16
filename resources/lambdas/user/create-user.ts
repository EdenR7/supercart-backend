import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { User } from "../../../models/user/user.model";
import { CreateUserInput } from "../../../models/user/types";
import { errorResponse, successResponse } from "shared/http-responses";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Parse request body
    if (!event.body) {
      return errorResponse(400, "Request body is required");
    }

    const requestBody: CreateUserInput = JSON.parse(event.body);

    // Validate required fields
    if (!requestBody.email || !requestBody.password || !requestBody.username) {
      return errorResponse(400, "Email, password, and username are required");
    }

    // Create user using the User model
    const newUser = await User.create(requestBody);

    return successResponse(201, "User created successfully", newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return errorResponse(500, "Failed to create user");
  }
};
