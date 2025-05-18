import { NextRequest } from 'next/server';
import { createLogoutResponse } from '@/lib/auth-utils';

export async function POST(req: NextRequest) {
  return createLogoutResponse();
}
