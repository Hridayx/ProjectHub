import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase-client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { AUTH_ERRORS, ApiErrorResponse, handleApiError } from '@/lib/api-error';
import { generateToken, setAuthCookie } from '@/lib/auth-utils';

// Input validation schema
const registerSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  email: z
    .string()
    .email()
    .refine(
      (email) => email.endsWith('@mahindrauniversity.edu.in'),
      'Only @mahindrauniversity.edu.in email addresses are allowed'
    ),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const validatedData = registerSchema.parse(body);
    const { username, email, password } = validatedData;

    // Check if user already exists
    const { data: existingUser, error: lookupError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (lookupError && lookupError.code !== 'PGRST116') {
      console.error('User lookup error:', lookupError);
      throw new ApiErrorResponse(AUTH_ERRORS.SERVER_ERROR);
    }

    if (existingUser) {
      throw new ApiErrorResponse(AUTH_ERRORS.USER_EXISTS);
    }    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('Inserting new user:', { username, email, hashedPassword });
    
    // Insert new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        username,
        email,
        password: hashedPassword,
        role: 'student', // Default role
        is_verified: false, // Require email verification
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('id, username, email, role, is_verified')
      .single();

    if (insertError) {
      console.error('User insertion error:', insertError);
      throw new ApiErrorResponse(AUTH_ERRORS.SERVER_ERROR);
    }

    if (!newUser) {
      console.error('No user data returned after insertion');
      throw new ApiErrorResponse(AUTH_ERRORS.SERVER_ERROR);
    }

    // Generate JWT token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      isVerified: false
    });

    // Set auth cookie - default to 24 hours for new registrations
    setAuthCookie(token, 24 * 60 * 60);

    return Response.json({
      message: 'Registration successful. Please check your email for verification.',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        is_verified: newUser.is_verified,
      },
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          error: {
            code: 'auth/validation-error',
            message: error.errors[0].message,
            status: 400,
          },
        },
        { status: 400 }
      );
    }
    return handleApiError(error);
  }
}
