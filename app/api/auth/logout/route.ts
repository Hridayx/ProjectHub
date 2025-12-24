import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_ERRORS, handleApiError } from '@/lib/api-error';
import { removeAuthCookie } from '@/lib/auth-utils';

export async function POST(req: NextRequest) {
  try {
    // Use the centralized auth utility to remove the cookie
    await removeAuthCookie();

    return Response.json
    ({
      message: 'Logged out successfully'
    });
  } 
  catch (error)
  {
    return handleApiError(error);
  }
}
