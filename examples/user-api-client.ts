// Example client for User API
// This demonstrates how to interact with the User API endpoints

import { UserResponse, CreateUserRequest, UpdateUserRequest, UsersListResponse, ApiResponse } from '../lib/types/user';

class UserApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3000/api/users') {
    this.baseUrl = baseUrl;
  }

  // Helper method for making API requests
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const data = await response.json();
    return data;
  }

  // Get all users with optional filtering and pagination
  async getUsers(params?: {
    page?: number;
    limit?: number;
    type?: string;
    city?: string;
    verified?: boolean;
    role?: string;
    search?: string;
  }): Promise<ApiResponse<UsersListResponse>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const endpoint = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.makeRequest<UsersListResponse>(endpoint);
  }

  // Get a single user by ID
  async getUserById(id: string): Promise<ApiResponse<UserResponse>> {
    return this.makeRequest<UserResponse>(`/${id}`);
  }

  // Create a new user
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<UserResponse>> {
    return this.makeRequest<UserResponse>('', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Update an existing user
  async updateUser(id: string, userData: UpdateUserRequest): Promise<ApiResponse<UserResponse>> {
    return this.makeRequest<UserResponse>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Delete a user
  async deleteUser(id: string): Promise<ApiResponse<null>> {
    return this.makeRequest<null>(`/${id}`, {
      method: 'DELETE',
    });
  }
}

// Example usage
export async function exampleUsage() {
  const client = new UserApiClient();

  try {
    console.log('=== User API Client Example ===\n');

    // 1. Create a new user
    console.log('1. Creating a new user...');
    const newUser: CreateUserRequest = {
      email_id: 'example@test.com',
      mobile: '+1234567890',
      type: 'buyer',
      name: 'Example User',
      city: 'Example City',
      profession: 'Software Developer',
      verified: false,
      password: 'securepassword123',
      role: 'user'
    };

    const createResponse = await client.createUser(newUser);
    if (createResponse.success && createResponse.data) {
      console.log('✅ User created successfully:', createResponse.data);
      const userId = createResponse.data.id;

      // 2. Fetch the created user
      console.log('\n2. Fetching the created user...');
      const fetchResponse = await client.getUserById(userId);
      if (fetchResponse.success && fetchResponse.data) {
        console.log('✅ User fetched successfully:', fetchResponse.data);
      } else {
        console.log('❌ Failed to fetch user:', fetchResponse.error);
      }

      // 3. Update the user
      console.log('\n3. Updating the user...');
      const updateData: UpdateUserRequest = {
        verified: true,
        city: 'Updated City',
        profession: 'Senior Software Developer'
      };

      const updateResponse = await client.updateUser(userId, updateData);
      if (updateResponse.success && updateResponse.data) {
        console.log('✅ User updated successfully:', updateResponse.data);
      } else {
        console.log('❌ Failed to update user:', updateResponse.error);
      }

      // 4. Get all users with filtering
      console.log('\n4. Fetching all verified users...');
      const usersResponse = await client.getUsers({
        verified: true,
        page: 1,
        limit: 10
      });

      if (usersResponse.success && usersResponse.data) {
        console.log('✅ Users fetched successfully:');
        console.log(`Total: ${usersResponse.data.total}`);
        console.log(`Page: ${usersResponse.data.page}/${usersResponse.data.totalPages}`);
        console.log('Users:', usersResponse.data.users);
      } else {
        console.log('❌ Failed to fetch users:', usersResponse.error);
      }

      // 5. Search users
      console.log('\n5. Searching for users...');
      const searchResponse = await client.getUsers({
        search: 'Example',
        limit: 5
      });

      if (searchResponse.success && searchResponse.data) {
        console.log('✅ Search completed successfully:');
        console.log(`Found ${searchResponse.data.total} users matching "Example"`);
      } else {
        console.log('❌ Search failed:', searchResponse.error);
      }

      // 6. Delete the user
      console.log('\n6. Deleting the user...');
      const deleteResponse = await client.deleteUser(userId);
      if (deleteResponse.success) {
        console.log('✅ User deleted successfully');
      } else {
        console.log('❌ Failed to delete user:', deleteResponse.error);
      }

    } else {
      console.log('❌ Failed to create user:', createResponse.error);
    }

  } catch (error) {
    console.error('❌ Error in example usage:', error);
  }
}

// Example of error handling
export async function exampleErrorHandling() {
  const client = new UserApiClient();

  console.log('\n=== Error Handling Examples ===\n');

  try {
    // 1. Try to create user with invalid data
    console.log('1. Testing validation errors...');
    const invalidUser: CreateUserRequest = {
      email_id: 'invalid-email',
      type: 'invalid-type' as any,
      name: ''
    };

    const response = await client.createUser(invalidUser);
    if (!response.success) {
      console.log('✅ Validation error caught:', response.error);
    }

    // 2. Try to fetch non-existent user
    console.log('\n2. Testing 404 error...');
    const notFoundResponse = await client.getUserById('999999');
    if (!notFoundResponse.success) {
      console.log('✅ 404 error caught:', notFoundResponse.error);
    }

    // 3. Try to use invalid ID format
    console.log('\n3. Testing invalid ID format...');
    const invalidIdResponse = await client.getUserById('invalid-id');
    if (!invalidIdResponse.success) {
      console.log('✅ Invalid ID error caught:', invalidIdResponse.error);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Export the client for use in other files
export default UserApiClient;

// If running this file directly, run the examples
if (require.main === module) {
  exampleUsage()
    .then(() => exampleErrorHandling())
    .then(() => console.log('\n=== Examples completed ==='))
    .catch(console.error);
}
