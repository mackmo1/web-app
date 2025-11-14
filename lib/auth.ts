import crypto from 'crypto';
import { NextRequest } from 'next/server';

export const AUTH_COOKIE_NAME = 'auth_token';
const JWT_ALG = 'HS256';
const DEFAULT_EXPIRY_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface AuthTokenPayload {
  name: string | null;
  email: string;
  role: string | null;
  iat: number; // issued at (seconds since epoch)
  exp: number; // expiry (seconds since epoch)
}

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET is not set');
  }
  return secret;
}

function base64UrlEncode(value: string | Buffer): string {
  const buffer = typeof value === 'string' ? Buffer.from(value, 'utf8') : value;
  return buffer
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(value: string): Buffer {
  // Pad the string with '=' to make length a multiple of 4
  const padLength = (4 - (value.length % 4)) % 4;
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(padLength);
  return Buffer.from(padded, 'base64');
}

function sign(data: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export function signAuthToken(
  payloadBase: { name: string | null; email: string; role: string | null },
  expiresInSeconds: number = DEFAULT_EXPIRY_SECONDS,
): string {
  const secret = getAuthSecret();
  const header = { alg: JWT_ALG, typ: 'JWT' };
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresInSeconds;

  const payload: AuthTokenPayload = {
    name: payloadBase.name,
    email: payloadBase.email,
    role: payloadBase.role,
    iat,
    exp,
  };

  const headerEnc = base64UrlEncode(JSON.stringify(header));
  const payloadEnc = base64UrlEncode(JSON.stringify(payload));
  const data = `${headerEnc}.${payloadEnc}`;
  const signature = sign(data, secret);

  return `${data}.${signature}`;
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    const secret = getAuthSecret();
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerEnc, payloadEnc, signature] = parts;
    const data = `${headerEnc}.${payloadEnc}`;
    const expectedSig = sign(data, secret);

    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSig);
    if (
      sigBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
    ) {
      return null;
    }

    const payloadJson = base64UrlDecode(payloadEnc).toString('utf8');
    const payload = JSON.parse(payloadJson) as AuthTokenPayload;

    if (!payload || !payload.email) return null;

    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp !== 'number' || payload.exp < now) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error('Failed to verify auth token:', error);
    return null;
  }
}

export function getAuthTokenFromRequest(request: NextRequest): AuthTokenPayload | null {
  try {
    const cookie = request.cookies.get(AUTH_COOKIE_NAME);
    if (!cookie?.value) return null;
    return verifyAuthToken(cookie.value);
  } catch (error) {
    console.error('Failed to read auth token from request:', error);
    return null;
  }
}

