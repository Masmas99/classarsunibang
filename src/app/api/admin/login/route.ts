import { NextResponse } from 'next/server';
import { createSessionToken, COOKIE_NAME } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const envUsername = process.env.ADMIN_USERNAME || 'admin';
    const envPassword = process.env.ADMIN_PASSWORD || 'arsadmin2025';

    let isValid = false;

    // Check environment variables first
    if (username === envUsername && password === envPassword) {
      isValid = true;
    } else {
      // Fallback check against database Admin table
      try {
        const dbAdmin = await prisma.admin.findUnique({
          where: { username },
        });
        if (dbAdmin && dbAdmin.password === password) {
          isValid = true;
        }
      } catch {
        // If DB not ready yet or admin not in db
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      );
    }

    const token = await createSessionToken(username);

    const response = NextResponse.json({
      success: true,
      message: 'Berhasil login',
      user: { username },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
