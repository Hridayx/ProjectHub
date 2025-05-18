import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Set runtime config to nodejs
export const runtime = 'nodejs';

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/projects',
  '/submit-idea',
  '/tasks',
  '/mentor-projects',
  '/community-projects',
];

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/signup', '/about', '/contact'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Allow API routes to handle their own auth
  if (path.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Public routes don't require auth
  if (publicRoutes.some(route => path.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if the path is protected
  if (protectedRoutes.some(route => path.startsWith(route))) {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    try {
      // Let the request through with the existing token
      return NextResponse.next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('error', 'Session expired. Please login again.');
      return NextResponse.redirect(redirectUrl);
    }
  }

  // For all other routes, proceed normally
  return NextResponse.next();
}

// Configure middleware matching
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
