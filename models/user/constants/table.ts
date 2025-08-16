// Table configuration constants for User model
export const USER_TABLE_NAME = "supermarket-users"; // DynamoDB table name for users (changed from "users" to avoid conflicts)
export const USER_TABLE_REGION = "us-east-1"; // AWS region for the table
export const USER_TABLE_BILLING_MODE = "PAY_PER_REQUEST"; // Billing mode for cost optimization
export const USER_TABLE_REMOVAL_POLICY = "DESTROY"; // Table removal policy for development
export const USER_TABLE_STREAM_VIEW = "NEW_AND_OLD_IMAGES"; // Stream view for real-time updates
export const USER_TABLE_MAX_ITEMS_PER_QUERY = 100; // Maximum items returned per query
export const USER_TABLE_DEFAULT_LIMIT = 50; // Default limit for list operations
