import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';
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

  const projectId = String(id)

  if (!projectId) {
    return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });
  }


  let dbUser = await prisma.user.findUnique({
    where: { auth_id: user.id }
  })

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const whereClause = dbUser.role === 'ADMIN' ?
    { id: projectId } :
    { id: projectId, createdBy: dbUser.id };

  const project = await prisma.project.findFirst({
    where: whereClause,
    include: {
      bugs: {
        include: {
          screenshots: true,
        },
      },
    },
  });

  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

  return NextResponse.json(project);
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {

  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const projectId = String(id);
  if (!projectId) {
    return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });
  }

  const data = await req.json();

  let updatedData = {
    ...data
  };

  if (data.name) {
    updatedData.slug = slugify(data.name, { lower: true, strict: true });
  }

  let dbUser = await prisma.user.findUnique({
    where: { auth_id: user.id }
  })

  if (!dbUser) {
  return NextResponse.json({ error: "User not found" }, { status: 404 });
}

  const whereClause = dbUser.role === 'ADMIN' ?
    { id: projectId } :
    { id: projectId, createdBy: dbUser.id };

  const updated = await prisma.project.update({
    where: whereClause,
    data: updatedData,
  });

  if (!updated) return NextResponse.json({ error: 'Project not found or not yours' }, { status: 404 });

  const updatedProject = await prisma.project.findUnique({
    where: { id: projectId },
  });

  return NextResponse.json(updatedProject);
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const projectId = String(id);
  if (!projectId) {
    return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });
  }

  let dbUser = await prisma.user.findUnique({
    where: { auth_id: user.id }
  })

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const whereClause = dbUser.role === 'ADMIN' ?
    { id: projectId } :
    { id: projectId, createdBy: dbUser.id };

  const deleted = await prisma.project.deleteMany({
    where: whereClause,
  });

  if (deleted.count === 0) return NextResponse.json({ error: 'Project not found or not yours' }, { status: 404 });

  return NextResponse.json({ success: true });
}
