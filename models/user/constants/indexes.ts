// Global Secondary Index constants for User model
export const USER_EMAIL_INDEX_NAME = "email-index"; // GSI name for email-based queries
export const USER_USERNAME_INDEX_NAME = "username-index"; // GSI name for username-based queries
export const USER_EMAIL_INDEX_PROJECTION = "ALL"; // Projection type for email index
export const USER_USERNAME_INDEX_PROJECTION = "ALL"; // Projection type for username index
export const USER_EMAIL_INDEX_LIMIT = 1; // Limit for email index queries (should be unique)
export const USER_USERNAME_INDEX_LIMIT = 1; // Limit for username index queries (should be unique)
