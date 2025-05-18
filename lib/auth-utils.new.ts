import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AUTH_ERRORS, ApiErrorResponse } from './api-error';
import { supabase } from './supabase-client';

// Ensure JWT secret is available
const JWT_SECRET = process.env.JWT_SECRET;

export interface JWTPayload extends JwtPayload {
  userId: string;
  email: string;
  role: 'student' | 'mentor' | 'admin';
  isVerified: boolean;
  username: string;
}

/**
 * Common cookie options to ensure consistency across operations
 */
export const COOKIE_OPTIONS = {
  name: 'auth-token',
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/'
  }
};

/**
 * Gets cookies from either NextRequest or NextResponse
 */
function getCookies(req?: NextRequest) {
  if (req?.cookies) {
    return req.cookies;
  }
  return cookies();
}

/**
 * Verifies the authentication token and returns the decoded payload
 */
export async function verifyAuth(req: NextRequest): Promise<JWTPayload> {
  const token = req.cookies.get(COOKIE_OPTIONS.name)?.value;

  if (!token || !JWT_SECRET) {
    throw new ApiErrorResponse(AUTH_ERRORS.UNAUTHORIZED);
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    
    // Verify user still exists in Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('id, is_verified')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      throw new ApiErrorResponse(AUTH_ERRORS.UNAUTHORIZED);
    }

    if (!user.is_verified && decoded.isVerified) {
      // Token claims user is verified but they're not - revoke access
      throw new ApiErrorResponse(AUTH_ERRORS.EMAIL_NOT_VERIFIED);
    }

    return decoded;
  } catch (error) {
    if (error instanceof ApiErrorResponse) {
      throw error;
    } else {
      throw new ApiErrorResponse(AUTH_ERRORS.UNAUTHORIZED);
    }
  }
}

/**
 * Generates a JWT token for authentication
 */
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>) {
  if (!JWT_SECRET) {
    throw new ApiErrorResponse(AUTH_ERRORS.SERVER_ERROR);
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h',
  });
}

/**
 * Creates a response with authentication cookie
 */
export function createAuthResponse(token: string, responseData: any = {}, maxAge: number = 24 * 60 * 60) {
  const response = NextResponse.json(responseData);

  response.cookies.set({
    ...COOKIE_OPTIONS.options,
    name: COOKIE_OPTIONS.name,
    value: token,
    maxAge
  });

  return response;
}

/**
 * Creates a response that removes the authentication cookie
 */
export function createLogoutResponse(responseData: any = { message: 'Logged out successfully' }) {
  const response = NextResponse.json(responseData);

  response.cookies.set({
    ...COOKIE_OPTIONS.options,
    name: COOKIE_OPTIONS.name,
    value: '',
    maxAge: 0
  });

  return response;
}
