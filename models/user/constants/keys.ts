// DynamoDB key constants for User model
export const USER_PK_PREFIX = "USER#"; // Partition key prefix for user items
export const USER_SK_PREFIX = "USER#"; // Sort key prefix for user items
export const USER_EMAIL_PK_PREFIX = "EMAIL#"; // GSI1 partition key prefix for email lookups
export const USER_USERNAME_PK_PREFIX = "USERNAME#"; // GSI2 partition key prefix for username lookups
export const USER_CREATED_SK_PREFIX = "CREATED#"; // Sort key prefix for creation time
export const USER_UPDATED_SK_PREFIX = "UPDATED#"; // Sort key prefix for update time
