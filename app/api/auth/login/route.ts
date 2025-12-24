import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase-client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { AUTH_ERRORS, ApiErrorResponse, handleApiError } from '@/lib/api-error';
import { generateToken, setAuthCookie } from '@/lib/auth-utils';

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
    
    // Validate input
    const validatedData = loginSchema.parse(body);
    const { email, password, rememberMe } = validatedData;

    // Find user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, email, password, role, is_verified')
      .eq('email', email)
      .single();

    if (userError || !user) {
      throw new ApiErrorResponse(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new ApiErrorResponse(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    // Check if email is verified
    if (!user.is_verified) {
      throw new ApiErrorResponse(AUTH_ERRORS.EMAIL_NOT_VERIFIED);
    }    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.is_verified
    });
    
    // Set auth cookie with optional remember me
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 24 hours
    setAuthCookie(token, maxAge);

    return Response.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          error: {
            code: 'auth/validation-error',
            message: error.message,
            status: 400,
          },
        },
        { status: 400 }
      );
    }
    return handleApiError(error);
  }
}
