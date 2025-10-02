// Example test file for User API
// This is a demonstration of how to test the API endpoints
// You can run these tests with Jest or your preferred testing framework

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

// Mock data for testing
const testUser = {
  email_id: 'test@example.com',
  mobile: '+1234567890',
  type: 'buyer',
  name: 'Test User',
  city: 'Test City',
  profession: 'Tester',
  verified: false,
  password: 'testpassword',
  role: 'user'
};

const baseUrl = 'http://localhost:3000/api/users';

describe('User API Tests', () => {
  let createdUserId: string;

  // Test POST /api/users - Create User
  describe('POST /api/users', () => {
    it('should create a new user successfully', async () => {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser),
      });

      const data = await response.json();
      
      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.email_id).toBe(testUser.email_id);
      expect(data.data.type).toBe(testUser.type);
      expect(data.data.password).toBeUndefined(); // Password should not be returned
      
      createdUserId = data.data.id;
    });

    it('should fail to create user with invalid email', async () => {
      const invalidUser = { ...testUser, email_id: 'invalid-email' };
      
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidUser),
      });

      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Invalid email format');
    });

    it('should fail to create user without required type', async () => {
      const invalidUser = { ...testUser };
      delete invalidUser.type;
      
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidUser),
      });

      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('User type is required');
    });
  });

  // Test GET /api/users - Get All Users
  describe('GET /api/users', () => {
    it('should fetch all users with pagination', async () => {
      const response = await fetch(`${baseUrl}?page=1&limit=10`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.users).toBeInstanceOf(Array);
      expect(data.data.total).toBeGreaterThanOrEqual(0);
      expect(data.data.page).toBe(1);
      expect(data.data.limit).toBe(10);
    });

    it('should filter users by type', async () => {
      const response = await fetch(`${baseUrl}?type=buyer`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      
      if (data.data.users.length > 0) {
        data.data.users.forEach((user: any) => {
          expect(user.type).toBe('buyer');
        });
      }
    });

    it('should search users by name', async () => {
      const response = await fetch(`${baseUrl}?search=Test`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  // Test GET /api/users/[id] - Get User by ID
  describe('GET /api/users/[id]', () => {
    it('should fetch a user by ID', async () => {
      if (!createdUserId) {
        throw new Error('No user ID available for testing');
      }

      const response = await fetch(`${baseUrl}/${createdUserId}`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.id).toBe(createdUserId);
      expect(data.data.email_id).toBe(testUser.email_id);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await fetch(`${baseUrl}/999999`);
      const data = await response.json();
      
      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toContain('User not found');
    });

    it('should return 400 for invalid user ID', async () => {
      const response = await fetch(`${baseUrl}/invalid-id`);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Invalid user ID');
    });
  });

  // Test PUT /api/users/[id] - Update User
  describe('PUT /api/users/[id]', () => {
    it('should update a user successfully', async () => {
      if (!createdUserId) {
        throw new Error('No user ID available for testing');
      }

      const updateData = {
        name: 'Updated Test User',
        city: 'Updated City',
        verified: true
      };

      const response = await fetch(`${baseUrl}/${createdUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe(updateData.name);
      expect(data.data.city).toBe(updateData.city);
      expect(data.data.verified).toBe(updateData.verified);
    });

    it('should fail to update with invalid email', async () => {
      if (!createdUserId) {
        throw new Error('No user ID available for testing');
      }

      const updateData = { email_id: 'invalid-email' };

      const response = await fetch(`${baseUrl}/${createdUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Invalid email format');
    });
  });

  // Test DELETE /api/users/[id] - Delete User
  describe('DELETE /api/users/[id]', () => {
    it('should delete a user successfully', async () => {
      if (!createdUserId) {
        throw new Error('No user ID available for testing');
      }

      const response = await fetch(`${baseUrl}/${createdUserId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toContain('User deleted successfully');
    });

    it('should return 404 when trying to delete non-existent user', async () => {
      const response = await fetch(`${baseUrl}/999999`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toContain('User not found');
    });
  });
});

// Helper function to run manual tests
export async function runManualTests() {
  console.log('Running manual User API tests...');
  
  try {
    // Test creating a user
    console.log('1. Testing user creation...');
    const createResponse = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });
    const createData = await createResponse.json();
    console.log('Create response:', createData);
    
    if (createData.success) {
      const userId = createData.data.id;
      
      // Test fetching the user
      console.log('2. Testing user fetch...');
      const fetchResponse = await fetch(`${baseUrl}/${userId}`);
      const fetchData = await fetchResponse.json();
      console.log('Fetch response:', fetchData);
      
      // Test updating the user
      console.log('3. Testing user update...');
      const updateResponse = await fetch(`${baseUrl}/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: true }),
      });
      const updateData = await updateResponse.json();
      console.log('Update response:', updateData);
      
      // Test deleting the user
      console.log('4. Testing user deletion...');
      const deleteResponse = await fetch(`${baseUrl}/${userId}`, {
        method: 'DELETE',
      });
      const deleteData = await deleteResponse.json();
      console.log('Delete response:', deleteData);
    }
    
    console.log('Manual tests completed!');
  } catch (error) {
    console.error('Error running manual tests:', error);
  }
}
