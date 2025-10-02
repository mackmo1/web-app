# User API Documentation

This document describes the CRUD API endpoints for user management in the Real Estate Agency application.

## Base URL
```
http://localhost:3000/api/users
```

## Authentication
Currently, the API does not require authentication. In production, you should implement proper authentication and authorization.

## Data Models

### User Object
```typescript
{
  id: string;                    // User ID (converted from BigInt)
  created_at: string;           // ISO timestamp
  email_id: string | null;      // Email address
  mobile: string | null;        // Mobile number
  type: string;                 // User type: "buyer", "agent", "builder"
  name: string | null;          // Full name
  city: string | null;          // City
  profession: string | null;    // Profession
  verified: boolean;            // Verification status
  role: string | null;          // User role: "user", "admin", "moderator"
  // Note: password is never returned in responses
}
```

## API Endpoints

### 1. Get All Users
**GET** `/api/users`

Retrieve a paginated list of users with optional filtering.

#### Query Parameters
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `type` (optional): Filter by user type
- `city` (optional): Filter by city (partial match)
- `verified` (optional): Filter by verification status (true/false)
- `role` (optional): Filter by user role
- `search` (optional): Search in name and email

#### Example Request
```bash
GET /api/users?page=1&limit=10&type=buyer&verified=true&search=john
```

#### Response
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "1",
        "created_at": "2024-01-01T00:00:00.000Z",
        "email_id": "john@example.com",
        "mobile": "+1234567890",
        "type": "buyer",
        "name": "John Doe",
        "city": "New York",
        "profession": "Engineer",
        "verified": true,
        "role": "user"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### 2. Get User by ID
**GET** `/api/users/{id}`

Retrieve a specific user by their ID.

#### Example Request
```bash
GET /api/users/1
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "1",
    "created_at": "2024-01-01T00:00:00.000Z",
    "email_id": "john@example.com",
    "mobile": "+1234567890",
    "type": "buyer",
    "name": "John Doe",
    "city": "New York",
    "profession": "Engineer",
    "verified": true,
    "role": "user"
  }
}
```

### 3. Create User
**POST** `/api/users`

Create a new user.

#### Request Body
```json
{
  "email_id": "john@example.com",     // Optional
  "mobile": "+1234567890",           // Optional
  "type": "buyer",                   // Required: "buyer", "agent", "builder"
  "name": "John Doe",                // Optional
  "city": "New York",                // Optional
  "profession": "Engineer",          // Optional
  "verified": false,                 // Optional (default: false)
  "password": "securepassword",      // Optional
  "role": "user"                     // Optional (default: "user")
}
```

#### Validation Rules
- `type` is required and must be one of: "buyer", "agent", "builder"
- Either `email_id` or `mobile` must be provided
- `email_id` must be a valid email format
- `mobile` must be a valid phone number format
- `password` must be at least 6 characters if provided
- Email and mobile must be unique across all users

#### Response
```json
{
  "success": true,
  "data": {
    "id": "1",
    "created_at": "2024-01-01T00:00:00.000Z",
    "email_id": "john@example.com",
    "mobile": "+1234567890",
    "type": "buyer",
    "name": "John Doe",
    "city": "New York",
    "profession": "Engineer",
    "verified": false,
    "role": "user"
  },
  "message": "User created successfully"
}
```

### 4. Update User
**PUT** `/api/users/{id}`

Update an existing user. All fields are optional.

#### Request Body
```json
{
  "email_id": "newemail@example.com",
  "mobile": "+0987654321",
  "type": "agent",
  "name": "John Smith",
  "city": "Los Angeles",
  "profession": "Real Estate Agent",
  "verified": true,
  "password": "newpassword",
  "role": "admin"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "1",
    "created_at": "2024-01-01T00:00:00.000Z",
    "email_id": "newemail@example.com",
    "mobile": "+0987654321",
    "type": "agent",
    "name": "John Smith",
    "city": "Los Angeles",
    "profession": "Real Estate Agent",
    "verified": true,
    "role": "admin"
  },
  "message": "User updated successfully"
}
```

### 5. Delete User
**DELETE** `/api/users/{id}`

Delete a user by their ID.

#### Example Request
```bash
DELETE /api/users/1
```

#### Response
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Additional details (optional)"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created (for POST requests)
- `400` - Bad Request (validation errors, invalid parameters)
- `404` - Not Found (user doesn't exist)
- `409` - Conflict (duplicate email/mobile)
- `500` - Internal Server Error

### Example Error Response
```json
{
  "success": false,
  "error": "Validation failed",
  "message": "email_id: Invalid email format, type: User type is required"
}
```

## Usage Examples

### JavaScript/TypeScript Client
```typescript
// Fetch all users
const response = await fetch('/api/users?page=1&limit=10');
const data = await response.json();

// Create a user
const newUser = await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email_id: 'user@example.com',
    type: 'buyer',
    name: 'New User'
  })
});

// Update a user
const updatedUser = await fetch('/api/users/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    verified: true
  })
});

// Delete a user
const deleteResponse = await fetch('/api/users/1', {
  method: 'DELETE'
});
```

## Security Considerations

1. **Password Handling**: Passwords are currently stored as-is. In production, implement proper password hashing using bcrypt.
2. **Authentication**: Add authentication middleware to protect endpoints.
3. **Authorization**: Implement role-based access control.
4. **Rate Limiting**: Add rate limiting to prevent abuse.
5. **Input Sanitization**: Sanitize all user inputs to prevent injection attacks.
6. **HTTPS**: Always use HTTPS in production.

## Database Schema

The API works with the following Prisma schema:

```prisma
model user {
  id         BigInt   @id @default(autoincrement())
  created_at DateTime @default(now()) @db.Timestamptz(6)
  email_id   String?  @unique @db.VarChar
  mobile     String?  @unique @db.VarChar
  type       String   @db.VarChar
  name       String?  @db.VarChar
  city       String?  @db.VarChar
  profession String?  @db.VarChar
  verified   Boolean
  password   String?  @db.VarChar
  role       String?  @db.VarChar
}
```
