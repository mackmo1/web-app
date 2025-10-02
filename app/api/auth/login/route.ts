import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { formatUserResponse, isValidEmail } from '@/lib/utils/user';

// POST /api/auth/login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email: string | undefined = body?.email;
    const password: string | undefined = body?.password;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email_id: email } });

    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    // NOTE: Passwords are currently stored as plain text in your setup.
    // Replace this comparison with bcrypt.compare() once hashing is implemented.
    if (!user.password || user.password !== password) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    // Return sanitized user info (no password)
    return NextResponse.json({ success: true, data: formatUserResponse(user) });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
