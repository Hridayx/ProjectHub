import { NextRequest } from 'next/server';
import { RequestCookies } from 'next/dist/server/web/spec-extension/cookies';
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
}

/**
 * Gets cookies from either NextRequest or NextResponse
 */
function getCookies(req?: NextRequest): RequestCookies {
  if (req?.cookies) {
    return req.cookies;
  }
  // Using dynamic import to avoid RSC errors
  const { cookies } = require('next/headers');
  return cookies();
}

/**
 * Verifies the authentication token and returns the decoded payload
 */
export async function verifyAuth(req: NextRequest): Promise<JWTPayload> {
  const cookieStore = getCookies(req);
  const token = cookieStore.get('auth-token')?.value;

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
      cookieStore.delete('auth-token');
      throw new ApiErrorResponse(AUTH_ERRORS.UNAUTHORIZED);
    }

    if (!user.is_verified && decoded.isVerified) {
      // Token claims user is verified but they're not - revoke access
      cookieStore.delete('auth-token');
      throw new ApiErrorResponse(AUTH_ERRORS.EMAIL_NOT_VERIFIED);
    }

    return decoded;
  } catch (error) {
    if (error instanceof ApiErrorResponse) {
      throw error;
    }
    cookieStore.delete('auth-token');
    throw new ApiErrorResponse(AUTH_ERRORS.UNAUTHORIZED);
  }
}

/**
 * Generates a JWT token for authentication
 */
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>) {  if (!JWT_SECRET) {
    throw new ApiErrorResponse(AUTH_ERRORS.SERVER_ERROR);
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h',
  });
}

/**
 * Sets the authentication cookie with the JWT token
 */
export function setAuthCookie(token: string, maxAge: number = 24 * 60 * 60) {
  const cookieStore = getCookies();
  // Next.js cookies() API only accepts name and value
  cookieStore.set('auth-token', token);
}

/**
 * Removes the authentication cookie
 */
export function removeAuthCookie() {
  const cookieStore = getCookies();
  cookieStore.delete('auth-token');
}

/**
 * Verifies that an email domain is from Mahindra University
 */
export function verifyEmailDomain(email: string): boolean {
  return email.endsWith('@mahindrauniversity.edu.in');
}

/**
 * Verifies password complexity requirements
 */
export function verifyPasswordStrength(password: string): { isValid: boolean; message?: string } {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);

  if (password.length < minLength) {
    return {
      isValid: false,
      message: `Password must be at least ${minLength} characters long`,
    };
  }

  if (!hasUppercase || !hasLowercase) {
    return {
      isValid: false,
      message: 'Password must contain both uppercase and lowercase letters',
    };
  }

  if (!hasNumber) {
    return {
      isValid: false,
      message: 'Password must contain at least one number',
    };
  }

  if (!hasSpecialChar) {
    return {
      isValid: false,
      message: 'Password must contain at least one special character (!@#$%^&*)',
    };
  }

  return { isValid: true };
}
