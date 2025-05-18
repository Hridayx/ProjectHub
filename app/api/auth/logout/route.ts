import { NextRequest } from 'next/server';
import { createLogoutResponse } from '@/lib/auth-utils';
import { handleApiError } from '@/lib/api-error';

export async function POST(req: NextRequest) {
  try {
    return createLogoutResponse();
  } catch (error) {
    return handleApiError(error);
  }
}
