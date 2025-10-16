// User types based on Prisma schema
export interface User {
  id: bigint;
  created_at: Date;
  email_id: string | null;
  mobile: string | null;
  type: string;
  name: string | null;
  city: string | null;
  profession: string | null;
  verified: boolean;
  password: string | null;
  role: string | null;
}

// Request types for API operations
export interface CreateUserRequest {
  email_id?: string;
  mobile?: string;
  type: string;
  name?: string;
  city?: string;
  profession?: string;
  verified?: boolean;
  password?: string;
  role?: string;
}

export interface UpdateUserRequest {
  email_id?: string;
  mobile?: string;
  type?: string;
  name?: string;
  city?: string;
  profession?: string;
  verified?: boolean;
  password?: string;
  role?: string;
}

// Response types
export interface UserResponse {
  id: string; // Convert bigint to string for JSON serialization
  created_at: string;
  email_id: string | null;
  mobile: string | null;
  type: string;
  name: string | null;
  city: string | null;
  profession: string | null;
  verified: boolean;
  role: string | null;
  // Note: password is excluded from response for security
}

export interface UsersListResponse {
  users: UserResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Query parameters for filtering users
export interface UserQueryParams {
  page?: number;
  limit?: number;
  type?: string;
  city?: string;
  verified?: boolean;
  role?: string;
  search?: string; // For searching by name or email
}

// Validation schemas (can be used with libraries like Zod)
export interface UserValidationRules {
  email_id?: {
    required?: boolean;
    format?: 'email';
  };
  mobile?: {
    required?: boolean;
    pattern?: string;
  };
  type: {
    required: true;
    enum: string[];
  };
  name?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
  };
  password?: {
    required?: boolean;
    minLength?: number;
  };
}

// Generic API response type that can be reused
export interface GenericApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
