// app/api/projects/[id]/bugs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getUserFromRequest } from '@/app/lib/auth';


interface RouteParams {
  params: Promise<{ id: string }>;
}


export async function GET(req: NextRequest, { params }: RouteParams) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const projectId = parseInt(id, 10);
  if (isNaN(projectId)) return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });

const bugs = await prisma.bug.findMany({
  where: { projectId },
  orderBy: { createdAt: 'desc' },
});

  return NextResponse.json(bugs);
}


export async function POST(req: NextRequest, { params }: RouteParams) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
  const projectId = parseInt(id, 10);
  if (isNaN(projectId)) return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });

  const { title, severity, description } = await req.json();
  if (!title || !severity) return NextResponse.json({ error: 'Title and severity required' }, { status: 400 });

  // Ensure the project belongs to the user
  const projectExists = await prisma.project.findFirst({
    where: { id: projectId, createdBy: user.id },
  });
  if (!projectExists) return NextResponse.json({ error: 'Project not found or not yours' }, { status: 404 });

  const bug = await prisma.bug.create({
    data: { title, severity, description, projectId },
  });

  return NextResponse.json(bug, { status: 201 });
}
