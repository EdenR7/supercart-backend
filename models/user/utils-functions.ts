import { IUser, UserDynamoItem } from "./types";
import { User } from "./user.model";

export function returnFullUserObject(user: UserDynamoItem): IUser {
  if (!user) {
    throw new Error("User not found");
  }
  if (
    !user.id ||
    !user.email ||
    !user.password ||
    !user.username ||
    !user.createdAt ||
    !user.updatedAt
  ) {
    throw new Error("User is missing required fields");
  }
  return {
    id: user.id,
    email: user.email,
    password: user.password,
    username: user.username,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function returnUserWithoutPassword(
  user: UserDynamoItem
): Omit<IUser, "password"> {
  if (!user) {
    throw new Error("User not found");
  }
  if (
    !user.id ||
    !user.email ||
    !user.username ||
    !user.createdAt ||
    !user.updatedAt
  ) {
    throw new Error("User is missing required fields");
  }
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
