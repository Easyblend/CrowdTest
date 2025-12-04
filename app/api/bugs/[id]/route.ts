// app/api/bugs/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getUserFromRequest } from '@/app/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const bugId = parseInt(params.id, 10);
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
