// app/api/bugs/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '../../../lib/auth';
import { createSupabaseServer } from '@/lib/supabaseServer';

interface RouteParams {
  params: Promise<{ id: string }>;
}
export async function GET(req: NextRequest, { params }: RouteParams) {
  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const bugId = id;

  if (!bugId) return NextResponse.json({ error: 'Invalid bug id' }, { status: 400 });

  let dbUser = await prisma.user.findUnique({
    where: { auth_id: user.id }
  })

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const bug = await prisma.bug.findFirst({
    where: {
      id: bugId,
      project: { createdBy: dbUser.id },
    },
  });

  if (!bug) return NextResponse.json({ error: 'Bug not found' }, { status: 404 });

  return NextResponse.json(bug);
}

export async function PUT(req: NextRequest, { params }: RouteParams) {

  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const bugId = String(id);
  if (!bugId) return NextResponse.json({ error: 'Invalid bug id' }, { status: 400 });

  const bugResolved = await prisma.bug.update({
    where: { id: bugId },
    data: { resolved: true },
  });

  return NextResponse.json(bugResolved);
}


export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const bugId = id;
  if (!bugId) return NextResponse.json({ error: 'Invalid bug id' }, { status: 400 });

  // Step 1: check ownership
  const bug = await prisma.bug.findUnique({
    where: { id: bugId },
    include: { project: true },
  });

  if (!bug) return NextResponse.json({ error: 'Bug not found' }, { status: 404 });

  const canDelete = user.role === 'ADMIN' || bug.project.createdBy === user.id;
  if (!canDelete) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });


  // Step 2: delete
  await prisma.bug.delete({ where: { id: bugId } });

  return NextResponse.json({ message: 'Bug deleted successfully' });
}
