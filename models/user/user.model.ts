import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { IUser, CreateUserInput } from "./types";
import {
  USER_TABLE_NAME,
  USER_TABLE_REGION,
  USER_EMAIL_INDEX_NAME,
  USER_USERNAME_INDEX_NAME,
} from "./constants";
import { v4 as uuidv4 } from "uuid";

export class User {
  // Static properties for table configuration
  private static readonly TABLE_NAME = USER_TABLE_NAME;
  private static readonly REGION = USER_TABLE_REGION;

  // Instance properties (user attributes)
  public id: string;
  public email: string;
  public password: string;
  public username: string;
  public createdAt: string;
  public updatedAt: string;

  // Private DynamoDB client
  private static client: DynamoDBDocumentClient;

  // Initialize DynamoDB client (static method)
  private static initializeClient(): DynamoDBDocumentClient {
    if (!User.client) {
      const dynamoClient = new DynamoDBClient({ region: User.REGION });
      User.client = DynamoDBDocumentClient.from(dynamoClient);
    }
    return User.client;
  }

  // Constructor
  constructor(data: Partial<IUser>) {
    this.id = data.id || "";
    this.email = data.email || "";
    this.password = data.password || "";
    this.username = data.username || "";
    this.createdAt = data.createdAt || "";
    this.updatedAt = data.updatedAt || "";
  }

  // CREATE - Simple user creation
  static async create(newUserData: CreateUserInput): Promise<User> {
    const now = new Date().toISOString();
    const userId = "1";

    // Check if user with same email or username already exists
    const existingUserByEmail = await User.findBy(
      "email",
      newUserData.email.toLowerCase()
    );
    if (existingUserByEmail) {
      throw new Error("User with this email already exists");
    }

    const userItem: IUser = {
      id: userId,
      email: newUserData.email.toLowerCase(),
      password: newUserData.password,
      username: newUserData.username.toLowerCase(),
      createdAt: now,
      updatedAt: now,
    };

    const client = User.initializeClient();
    await client.send(
      new PutCommand({
        TableName: User.TABLE_NAME,
        Item: {
          id: userId, // Partition Key
          createdAt: now, // Sort Key
          email: userItem.email,
          password: userItem.password,
          username: userItem.username,
          updatedAt: userItem.updatedAt,
        },
      })
    );

    return new User(userItem);
  }

  /**
   * FIND BY ID - Direct lookup using primary table
   * @param userId - The unique user ID to find
   * @returns User instance or null if not found
   */
  static async findById(userId: string): Promise<User> {
    const client = User.initializeClient();
    try {
      // For ID lookup, we need both partition key and sort key
      // Since we don't have the createdAt, we limit the result to 1
      const result = await client.send(
        new QueryCommand({
          TableName: User.TABLE_NAME,
          KeyConditionExpression: "id = :id",
          ExpressionAttributeValues: {
            ":id": userId,
          },
          Limit: 1,
        })
      );
      if (result.Items && result.Items.length > 0) {
        return new User(result.Items[0] as IUser);
      }
      throw new Error("User not found");
    } catch (error) {
      console.error(`Error finding user by ID:`, error);
      throw error;
    }
  }

  /**
   * FIND BY - General method for email/username lookups using GSIs
   * @param criteria - Either "email" or "username"
   * @param value - The email or username value to search for
   * @returns User instance or null if not found
   */
  static async findBy(
    criteria: "email" | "username",
    value: string
  ): Promise<User | null> {
    const client = User.initializeClient();

    try {
      // Use the appropriate GSI for email/username queries
      const indexName =
        criteria === "email" ? USER_EMAIL_INDEX_NAME : USER_USERNAME_INDEX_NAME;

      const result = await client.send(
        new QueryCommand({
          TableName: User.TABLE_NAME,
          IndexName: indexName,
          KeyConditionExpression: `${criteria} = :value`,
          ExpressionAttributeValues: {
            ":value": value.toLowerCase(),
          },
          Limit: 1,
        })
      );

      if (result.Items && result.Items.length > 0) {
        return new User(result.Items[0] as IUser);
      }
      return null;
    } catch (error) {
      console.error(`Error finding user by ${criteria}:`, error);
      return null;
    }
  }

  // LEGACY METHOD - Keep for backward compatibility
  static async findUserBy(
    criteria: "email" | "username" | "id",
    value: string
  ): Promise<User | null> {
    if (criteria === "id") {
      return User.findById(value);
    } else {
      return User.findBy(criteria, value);
    }
  }

  // Convert to plain object
  toJSON(): IUser {
    return {
      id: this.id,
      email: this.email,
      password: this.password,
      username: this.username,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
