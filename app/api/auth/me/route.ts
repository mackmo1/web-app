import { NextRequest, NextResponse } from 'next/server';
import { getAuthTokenFromRequest } from '@/lib/auth';

export const runtime = 'nodejs';

// GET /api/auth/me
export async function GET(request: NextRequest) {
  const payload = getAuthTokenFromRequest(request);

  if (!payload) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      name: payload.name,
      email: payload.email,
      role: payload.role,
    },
  });
}

