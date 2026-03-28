import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import slugify from 'slugify';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { slug } = await params;
  console.log('Received slug:', slug);
  console.log('Fetching project with slug:', slug);
  const projectId = parseInt(slug.split('-').pop() || '', 10);
  console.log('Parsed project ID:', projectId);
  if (isNaN(projectId)) {
    return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });
  }

  const whereClause = user.role === 'ADMIN' ?
    { id: projectId } :
    { id: projectId, createdBy: user.id };

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
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug } = await params;
  const projectId = parseInt(slug.split('-').pop() || '', 10);
  if (isNaN(projectId)) {
    return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });
  }

  const data = await req.json();

   let updatedData = {
    ...data
  };

  if (data.name) {
  updatedData.slug = slugify(data.name, { lower: true, strict: true });
}


  const whereClause = user.role === 'ADMIN' ?
    { id: projectId } :
    { id: projectId, createdBy: user.id };

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
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug } = await params;
  const projectId = parseInt(slug.split('-').pop() || '', 10);
  if (isNaN(projectId)) return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });

  const whereClause = user.role === 'ADMIN' ?
    { id: projectId } :
    { id: projectId, createdBy: user.id };

  const deleted = await prisma.project.deleteMany({
    where: whereClause,
  });

  if (deleted.count === 0) return NextResponse.json({ error: 'Project not found or not yours' }, { status: 404 });

  return NextResponse.json({ success: true });
}
