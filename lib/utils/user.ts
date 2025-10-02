import { User, UserResponse } from '../types/user';

// Convert Prisma user to API response format
export function formatUserResponse(user: User): UserResponse {
  return {
    id: user.id.toString(),
    created_at: user.created_at.toISOString(),
    email_id: user.email_id,
    mobile: user.mobile,
    type: user.type,
    name: user.name,
    city: user.city,
    profession: user.profession,
    verified: user.verified,
    role: user.role,
    // password is intentionally excluded for security
  };
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate mobile number (basic validation)
export function isValidMobile(mobile: string): boolean {
  const mobileRegex = /^[+]?[\d\s\-\(\)]{10,15}$/;
  return mobileRegex.test(mobile);
}

// Hash password (you should use bcrypt in production)
export async function hashPassword(password: string): Promise<string> {
  // For now, returning as-is. In production, use bcrypt:
  // const bcrypt = require('bcrypt');
  // return await bcrypt.hash(password, 10);
  return password;
}

// Validate user type
export function isValidUserType(type: string): boolean {
  const validTypes = ['buyer', 'agent', 'builder'];
  return validTypes.includes(type.toLowerCase());
}

// Validate user role
export function isValidUserRole(role: string): boolean {
  const validRoles = ['user', 'admin', 'moderator'];
  return validRoles.includes(role.toLowerCase());
}

// Build where clause for user filtering
export function buildUserWhereClause(params: {
  type?: string;
  city?: string;
  verified?: boolean;
  role?: string;
  search?: string;
}) {
  const where: Record<string, unknown> = {};

  if (params.type) {
    where.type = params.type;
  }

  if (params.city) {
    where.city = {
      contains: params.city,
      mode: 'insensitive',
    };
  }

  if (params.verified !== undefined) {
    where.verified = params.verified;
  }

  if (params.role) {
    where.role = params.role;
  }

  if (params.search) {
    where.OR = [
      {
        name: {
          contains: params.search,
          mode: 'insensitive',
        },
      },
      {
        email_id: {
          contains: params.search,
          mode: 'insensitive',
        },
      },
    ];
  }

  return where;
}
