import { returnUserWithoutPassword } from "@models/user/utils-functions";
import { User } from "../../../models/user/user.model";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { errorResponse, successResponse } from "shared/http-responses";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { id } = event.pathParameters as { id: string };
    console.info("TEST - ID", id);
    console.log("TEST - EVENT", event);

    if (!id) {
      return errorResponse(400, "User ID is required");
    }
    const user = await User.findUserBy("id", id);
    if (!user) {
      return errorResponse(404, "User not found");
    }

    return successResponse(200, "User retrieved successfully", returnUserWithoutPassword(user));
  } catch (error) {
    console.error("Error getting user:", error);
    return errorResponse(500, "Failed to get user");
  }
};
