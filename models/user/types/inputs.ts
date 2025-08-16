// Input types for user operations

// User creation input (without auto-generated fields)
export interface CreateUserInput {
  email: string;
  password: string;
  username: string;
}

// User update input (all fields optional)
export interface UpdateUserInput {
  email?: string;
  password?: string;
  username?: string;
}

// Query input types
export interface GetUserByIdInput {
  id: string;
}

export interface GetUserByEmailInput {
  email: string;
}

export interface GetUserByUsernameInput {
  username: string;
}
