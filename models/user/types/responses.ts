// Response types for user operations
import { IUser } from "./interfaces";

// User creation response
export interface CreateUserResponse {
  user: IUser;
  success: boolean;
  message?: string;
}

// User update response
export interface UpdateUserResponse {
  user: IUser;
  success: boolean;
  message?: string;
}

// User deletion response
export interface DeleteUserResponse {
  success: boolean;
  message?: string;
}

// Generic operation response
export interface OperationResponse {
  success: boolean;
  message?: string;
  error?: string;
}
