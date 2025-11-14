import crypto from 'crypto';
import { promisify } from 'util';
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

// Hash password using Node's built-in scrypt algorithm
// This avoids adding external dependencies while providing strong hashing.
// Format: "scrypt$<salt>$<hash>"

const scryptAsync = promisify(crypto.scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  const hash = derivedKey.toString('hex');
  return `scrypt$${salt}$${hash}`;
}

// Verify password against a stored hash. Supports both scrypt hashes and
// legacy plain-text passwords for backward compatibility.
export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  // New format using scrypt
  if (storedHash.startsWith('scrypt$')) {
    const [, salt, hash] = storedHash.split('$');
    if (!salt || !hash) return false;

    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    const computedHash = derivedKey.toString('hex');

    const hashBuffer = Buffer.from(hash, 'hex');
    const computedBuffer = Buffer.from(computedHash, 'hex');

    if (hashBuffer.length !== computedBuffer.length) return false;
    return crypto.timingSafeEqual(hashBuffer, computedBuffer);
  }

  // Fallback for legacy plain-text passwords (will be migrated on next login)
  return storedHash === password;
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
