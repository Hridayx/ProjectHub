import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// Load JWT secret from environment
const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET;

// Define protected routes
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/projects',
  '/submit-idea',
  '/tasks',
  '/mentor-projects',
  '/community-projects',
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the path is protected
  if (protectedRoutes.some(route => path.startsWith(route))) {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Get response from next middleware
    const response = NextResponse.next();

    // Set cookie options for auth-token
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    try {
      // Verify JWT
      if (JWT_SECRET) {
        jwt.verify(token, JWT_SECRET);
        return NextResponse.next();
      }
      // If JWT_SECRET is not available, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    } catch (error) {
      // Invalid or expired token
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Configure middleware matching
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/projects/:path*',
    '/submit-idea/:path*',
    '/tasks/:path*',
    '/mentor-projects/:path*',
    '/community-projects/:path*',
  ],
};
