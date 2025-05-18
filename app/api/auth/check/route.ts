import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase-client';
import { verifyAuth } from '@/lib/auth-utils';
import { AUTH_ERRORS, ApiErrorResponse, handleApiError } from '@/lib/api-error';

export async function GET(req: NextRequest) {
  try {
    // This will throw if not authenticated
    const decoded = await verifyAuth(req);

    // Get user details
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, email, role, is_verified')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      throw new ApiErrorResponse(AUTH_ERRORS.UNAUTHORIZED);
    }

    return Response.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}
