import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
  const projectId = parseInt(id, 10);
  if (isNaN(projectId)) {
    return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, createdBy: user.id },
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
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const projectId = parseInt(id, 10);
  if (isNaN(projectId)) {
    return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });
  }

  const data = await req.json();

  const updated = await prisma.project.updateMany({
    where: { id: projectId, createdBy: user.id },
    data,
  });

  if (updated.count === 0) return NextResponse.json({ error: 'Project not found or not yours' }, { status: 404 });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
  const projectId = parseInt(id, 10);
  if (isNaN(projectId)) return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });

  const deleted = await prisma.project.deleteMany({
    where: { id: projectId, createdBy: user.id },
  });

  if (deleted.count === 0) return NextResponse.json({ error: 'Project not found or not yours' }, { status: 404 });

  return NextResponse.json({ success: true });
}
