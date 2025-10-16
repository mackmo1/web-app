# Lead CRUD API Documentation

## Overview

This document describes the complete CRUD (Create, Read, Update, Delete) API for managing leads in the Real Estate Agency application. The API provides endpoints for creating, retrieving, updating, and deleting lead records with comprehensive validation and error handling.

## Base URL

All endpoints are relative to your application's base URL:
```
https://your-domain.com/api/leads
```

## Authentication

Currently, the API does not require authentication. In production, you should implement proper authentication and authorization.

## Data Model

### Lead Schema

```typescript
interface Lead {
  id: string;                    // Unique identifier
  created_at: string;           // ISO timestamp
  who: string;                  // Required: buyer, seller, investor, tenant, landlord
  intent: string;               // Required: buy, sell, rent, lease, invest
  property_type: string | null; // Optional: apartment, villa, plot, commercial, office, warehouse
  agent: string | null;         // Optional: assigned agent name
  status: string | null;        // Optional: new, contacted, qualified, converted, closed, lost
  name: string | null;          // Optional: lead's name
  phone: string;                // Required: contact phone number
  email_id: string;             // Required: contact email
  location: string;             // Required: property location
  message: string | null;       // Optional: additional message
  budget: string | null;        // Optional: budget range
  pin_no: string | null;        // Optional: PIN code
  address: string | null;       // Optional: detailed address
}
```

## API Endpoints

### 1. GET /api/leads

Retrieve a list of leads with optional filtering and pagination.

#### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number (default: 1) | `?page=2` |
| `limit` | number | Items per page (1-100, default: 10) | `?limit=20` |
| `who` | string | Filter by who field | `?who=buyer` |
| `intent` | string | Filter by intent | `?intent=buy` |
| `property_type` | string | Filter by property type | `?property_type=apartment` |
| `agent` | string | Filter by agent (partial match) | `?agent=john` |
| `status` | string | Filter by status | `?status=new` |
| `location` | string | Filter by location (partial match) | `?location=mumbai` |
| `search` | string | Search across name, email, phone, location | `?search=john` |
| `budget_min` | string | Minimum budget filter | `?budget_min=1000000` |
| `budget_max` | string | Maximum budget filter | `?budget_max=5000000` |
| `created_from` | string | Filter from date (ISO format) | `?created_from=2024-01-01` |
| `created_to` | string | Filter to date (ISO format) | `?created_to=2024-12-31` |

#### Example Request

```bash
GET /api/leads?page=1&limit=10&who=buyer&intent=buy&location=mumbai
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "leads": [
      {
        "id": "1",
        "created_at": "2024-01-15T10:30:00.000Z",
        "who": "buyer",
        "intent": "buy",
        "property_type": "apartment",
        "agent": "John Doe",
        "status": "new",
        "name": "Alice Smith",
        "phone": "+91-9876543210",
        "email_id": "alice@example.com",
        "location": "Mumbai",
        "message": "Looking for 2BHK apartment",
        "budget": "50L-1Cr",
        "pin_no": "400001",
        "address": "Bandra West, Mumbai"
      }
    ],
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

### 2. GET /api/leads/[id]

Retrieve a single lead by ID.

#### Example Request

```bash
GET /api/leads/1
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "id": "1",
    "created_at": "2024-01-15T10:30:00.000Z",
    "who": "buyer",
    "intent": "buy",
    "property_type": "apartment",
    "agent": "John Doe",
    "status": "new",
    "name": "Alice Smith",
    "phone": "+91-9876543210",
    "email_id": "alice@example.com",
    "location": "Mumbai",
    "message": "Looking for 2BHK apartment",
    "budget": "50L-1Cr",
    "pin_no": "400001",
    "address": "Bandra West, Mumbai"
  }
}
```

### 3. POST /api/leads

Create a new lead.

#### Request Body

```json
{
  "who": "buyer",                    // Required
  "intent": "buy",                   // Required
  "property_type": "apartment",      // Optional
  "agent": "John Doe",               // Optional
  "status": "new",                   // Optional (defaults to "new")
  "name": "Alice Smith",             // Optional
  "phone": "+91-9876543210",         // Required
  "email_id": "alice@example.com",   // Required
  "location": "Mumbai",              // Required
  "message": "Looking for 2BHK",     // Optional
  "budget": "50L-1Cr",               // Optional
  "pin_no": "400001",                // Optional
  "address": "Bandra West, Mumbai"   // Optional
}
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "id": "1",
    "created_at": "2024-01-15T10:30:00.000Z",
    "who": "buyer",
    "intent": "buy",
    "property_type": "apartment",
    "agent": "John Doe",
    "status": "new",
    "name": "Alice Smith",
    "phone": "+91-9876543210",
    "email_id": "alice@example.com",
    "location": "Mumbai",
    "message": "Looking for 2BHK apartment",
    "budget": "50L-1Cr",
    "pin_no": "400001",
    "address": "Bandra West, Mumbai"
  },
  "message": "Lead created successfully"
}
```

### 4. PUT /api/leads/[id]

Update an existing lead. All fields are optional.

#### Request Body

```json
{
  "status": "contacted",
  "agent": "Jane Doe",
  "message": "Updated requirements - now looking for 3BHK"
}
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "id": "1",
    "created_at": "2024-01-15T10:30:00.000Z",
    "who": "buyer",
    "intent": "buy",
    "property_type": "apartment",
    "agent": "Jane Doe",
    "status": "contacted",
    "name": "Alice Smith",
    "phone": "+91-9876543210",
    "email_id": "alice@example.com",
    "location": "Mumbai",
    "message": "Updated requirements - now looking for 3BHK",
    "budget": "50L-1Cr",
    "pin_no": "400001",
    "address": "Bandra West, Mumbai"
  },
  "message": "Lead updated successfully"
}
```

### 5. DELETE /api/leads/[id]

Delete a lead by ID.

#### Example Request

```bash
DELETE /api/leads/1
```

#### Example Response

```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

## Field Validation

### Required Fields

- `who`: Must be one of: buyer, seller, investor, tenant, landlord
- `intent`: Must be one of: buy, sell, rent, lease, invest
- `phone`: Must be 10-15 digits with optional country code
- `email_id`: Must be valid email format
- `location`: Cannot be empty, max 200 characters

### Optional Fields

- `property_type`: Must be one of: apartment, villa, plot, commercial, office, warehouse
- `status`: Must be one of: new, contacted, qualified, converted, closed, lost
- `name`: Max 100 characters
- `agent`: Max 100 characters
- `budget`: Numeric values with optional K/L/Cr suffixes or ranges
- `pin_no`: Must be exactly 6 digits
- `address`: Max 500 characters
- `message`: Max 1000 characters

## Error Responses

### Validation Error (400)

```json
{
  "success": false,
  "error": "Validation failed",
  "message": "who: Invalid who value. Must be one of: buyer, seller, investor, tenant, landlord"
}
```

### Not Found (404)

```json
{
  "success": false,
  "error": "Lead not found"
}
```

### Duplicate Entry (409)

```json
{
  "success": false,
  "error": "A lead with this email or phone number already exists"
}
```

### Internal Server Error (500)

```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Status Codes

- `200` - Success (GET, PUT)
- `201` - Created (POST)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

## Usage Examples

### Creating a Lead

```javascript
const response = await fetch('/api/leads', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    who: 'buyer',
    intent: 'buy',
    property_type: 'apartment',
    name: 'John Doe',
    phone: '+91-9876543210',
    email_id: 'john@example.com',
    location: 'Mumbai',
    budget: '1Cr'
  })
});

const result = await response.json();
```

### Filtering Leads

```javascript
const response = await fetch('/api/leads?who=buyer&status=new&page=1&limit=20');
const result = await response.json();
```

### Updating a Lead

```javascript
const response = await fetch('/api/leads/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    status: 'contacted',
    agent: 'Jane Smith'
  })
});

const result = await response.json();
```

## Database Schema

The Lead API works with the following Prisma schema:

```prisma
model Lead {
  id            BigInt   @id @default(autoincrement())
  created_at    DateTime @default(now()) @db.Timestamptz(6)
  who           String   @db.VarChar
  intent        String   @db.VarChar
  property_type String?  @db.VarChar
  agent         String?  @db.VarChar
  status        String?  @db.VarChar
  name          String?  @db.VarChar
  phone         String   @db.VarChar
  email_id      String   @db.VarChar
  location      String   @db.VarChar
  message       String?
  budget        String?  @db.VarChar
  pin_no        String?  @db.VarChar
  address       String?  @db.VarChar
}
```

## Best Practices

1. **Validation**: Always validate input on both client and server side
2. **Error Handling**: Implement proper error handling for all API calls
3. **Pagination**: Use pagination for large datasets to improve performance
4. **Filtering**: Implement appropriate filters based on your business needs
5. **Security**: Add authentication and authorization in production
6. **Rate Limiting**: Implement rate limiting to prevent API abuse
7. **Logging**: Add comprehensive logging for monitoring and debugging

## Testing

Use the provided test utilities in `tests/lead-api.test.ts` for manual testing and development.

## Support

For questions or issues with the Lead API, please refer to the main project documentation or contact the development team.
