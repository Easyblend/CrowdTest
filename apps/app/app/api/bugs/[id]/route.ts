// app/api/bugs/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/apps/app/app/lib/prisma';
import { getUserFromRequest } from '@/apps/app/app/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}
export async function GET(req: NextRequest, { params }: RouteParams) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const bugId = parseInt(id, 10);
  if (isNaN(bugId)) return NextResponse.json({ error: 'Invalid bug id' }, { status: 400 });

  const bug = await prisma.bug.findFirst({
    where: {
      id: bugId,
      project: { createdBy: user.id },
    },
  });

  if (!bug) return NextResponse.json({ error: 'Bug not found' }, { status: 404 });

  return NextResponse.json(bug);
}
