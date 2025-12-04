// app/api/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/app/lib/auth';

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  console.log('Fetched user in /api/me:', user);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return NextResponse.json(user);
}
