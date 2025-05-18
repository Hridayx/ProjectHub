import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/auth-utils';

// Add routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/about',
  '/contact',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/register',
];

// Add routes that require email verification
const verifiedRoutes = [
  '/submit-idea',
  '/mentor-projects',
  '/community-projects',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  try {
    // This will throw if not authenticated
    const decoded = await verifyAuth(request);

    // Check email verification for protected routes
    if (verifiedRoutes.some(route => pathname.startsWith(route)) && !decoded.isVerified) {
      return NextResponse.redirect(new URL('/login?verify=true', request.url));
    }

    // User is authenticated and verified if required, proceed
    return NextResponse.next();
  } catch (error) {
    // Redirect to login for failed auth
    const searchParams = new URLSearchParams();
    if (pathname !== '/') {
      searchParams.set('from', pathname);
    }
    const loginUrl = `/login${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public directory
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
