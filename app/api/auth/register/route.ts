import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase-client';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { AUTH_ERRORS, ApiErrorResponse, handleApiError } from '@/lib/api-error';
import { generateToken, createAuthResponse, verifyPasswordStrength } from '@/lib/auth-utils';
import type { User } from '@/types/auth';

const passwordRegex = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
);

// Input validation schema with custom messages
const registerSchema = z.object({
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters')
    .max(50, 'Username cannot exceed 50 characters')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Username can only contain letters, numbers, and ._-'),
  email: z
    .string()
    .email('Invalid email format')
    .toLowerCase()
    .trim()
    .refine(
      (email) => email.endsWith('@mahindrauniversity.edu.in'),
      'Only @mahindrauniversity.edu.in email addresses are allowed'
    ),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      passwordRegex,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
}) satisfies z.ZodType<{
  username: string;
  email: string;
  password: string;
}>;

type RegisterInput = z.infer<typeof registerSchema>;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as RegisterInput;
    
    // Validate input
    const validatedData = registerSchema.parse(body);
    const { username, email, password } = validatedData;

    // Additional password strength validation
    const passwordCheck = verifyPasswordStrength(password);
    if (!passwordCheck.isValid) {
      throw new ApiErrorResponse({
        code: AUTH_ERRORS.WEAK_PASSWORD.code,
        message: passwordCheck.message || AUTH_ERRORS.WEAK_PASSWORD.message,
        status: 400,
      });
    }

    // Check if user already exists
    const { data: existingUser, error: lookupError } = await supabase
      .from('users')
      .select('id, email')
      .or(`email.eq.${email},username.eq.${username}`)
      .single();

    if (lookupError && lookupError.code !== 'PGRST116') {
      console.error('User lookup error:', lookupError);
      throw new ApiErrorResponse(AUTH_ERRORS.SERVER_ERROR);
    }

    if (existingUser) {
      const errorType = existingUser.email === email ? 'email' : 'username';
      throw new ApiErrorResponse({
        ...AUTH_ERRORS.USER_EXISTS,
        message: `A user with this ${errorType} already exists`,
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create admin client for secure operations
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Insert new user with admin client
    const { data: newUser, error: insertError } = await adminClient
      .from('users')
      .insert({
        username,
        email,
        password: hashedPassword,
        role: 'student',
        is_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('id, username, email, role, is_verified')
      .single();

    if (insertError || !newUser) {
      console.error('User insertion error:', insertError);
      throw new ApiErrorResponse(AUTH_ERRORS.SERVER_ERROR);
    }

    // Generate verification token
    const token = generateToken({
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: 'student',
      isVerified: false
    });

    // TODO: Send verification email
    // This would be implemented in a separate service

    // Return success response
    return createAuthResponse(
      token,
      {
        message: 'Registration successful. Please check your email for verification.',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          is_verified: newUser.is_verified,
        } as User,
      },
      24 * 60 * 60 // 24 hours for initial registration
    );

  } catch (error) {    if (error instanceof z.ZodError && error.errors.length > 0) {
      const firstError = error.errors[0];
      if (!firstError) {
        throw new ApiErrorResponse(AUTH_ERRORS.SERVER_ERROR);
      }
      return Response.json(
        {
          error: {
            code: 'auth/validation-error',
            message: firstError.message,
            field: String(firstError.path[0] || 'unknown'),
            status: 400,
          },
        },
        { status: 400 }
      );
    }

    if (error instanceof ApiErrorResponse) {
      return Response.json(
        { error: error.error },
        { status: error.error.status }
      );
    }

    console.error('Registration error:', error);
    return handleApiError(error);
  }
}
