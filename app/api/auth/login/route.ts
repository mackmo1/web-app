import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { formatUserResponse, hashPassword, isValidEmail, verifyPassword } from '@/lib/utils/user';
import { AUTH_COOKIE_NAME, signAuthToken } from '@/lib/auth';

// Ensure this route runs on the Node.js runtime so we can use the crypto module
export const runtime = 'nodejs';

// POST /api/auth/login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email: string | undefined = body?.email;
    const password: string | undefined = body?.password;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { email_id: email } });

    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 },
      );
    }

    const storedPassword = user.password;
    let passwordValid = false;

    if (storedPassword.startsWith('scrypt$')) {
      // New hashed format
      passwordValid = await verifyPassword(password, storedPassword);
    } else {
      // Legacy plain-text password support (migrate on successful login)
      passwordValid = storedPassword === password;
      if (passwordValid) {
        try {
          const newHash = await hashPassword(password);
          await prisma.user.update({
            where: { id: user.id },
            data: { password: newHash },
          });
        } catch (err) {
          console.error('Failed to migrate legacy password hash:', err);
        }
      }
    }

    if (!passwordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 },
      );
    }

    const emailId = user.email_id || email;
    if (!emailId) {
      console.error('User record is missing email_id');
      return NextResponse.json(
        { success: false, error: 'Invalid account configuration' },
        { status: 500 },
      );
    }

    const token = signAuthToken({
      name: user.name ?? null,
      email: emailId,
      role: user.role ?? 'user',
    });

    const response = NextResponse.json({ success: true, data: formatUserResponse(user) });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
