import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase-client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { AUTH_ERRORS, ApiErrorResponse, handleApiError } from '@/lib/api-error';
import { generateToken, createAuthResponse } from '@/lib/auth-utils';

// Input validation schema
const loginSchema = z.object({
  email: z
    .string()
    .email()
    .refine(
      (email) => email.endsWith('@mahindrauniversity.edu.in'),
      'Only @mahindrauniversity.edu.in email addresses are allowed'
    ),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, rememberMe } = loginSchema.parse(body);

    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new ApiErrorResponse(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new ApiErrorResponse(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    // Check email verification
    if (!user.is_verified) {
      throw new ApiErrorResponse(AUTH_ERRORS.EMAIL_NOT_VERIFIED);
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.is_verified,
      username: user.username
    });

    // Remove sensitive data from user object
    const { password: _, ...safeUser } = user;

    // Return response with auth cookie
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days if remember me, else 24 hours
    return createAuthResponse(token, { user: safeUser }, maxAge);

  } catch (error) {
    return handleApiError(error);
  }
}
