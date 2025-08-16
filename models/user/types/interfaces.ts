// Main User interface - core model definition
export interface IUser {
  id: string;
  email: string;
  password: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

// DynamoDB item structure (what gets stored in the database)
export interface UserDynamoItem extends IUser {
  // DynamoDB specific fields (optional - can be added by the service layer)
  PK?: string; // Partition key: "USER#${id}"
  SK?: string; // Sort key: "USER#${id}"
  GSI1PK?: string; // GSI1 partition key: "EMAIL#${email}"
  GSI1SK?: string; // GSI1 sort key: "USER#${id}"
  GSI2PK?: string; // GSI2 partition key: "USERNAME#${username}"
  GSI2SK?: string; // GSI2 sort key: "USER#${id}"
}
