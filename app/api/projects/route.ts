import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getUserFromCookies } from '@/app/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getUserFromCookies();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: { createdBy: user.id },
    include: { bugs: true }, // include bug reports
  });

  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const user = await getUserFromCookies();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, url, description } = await req.json();

  if (!name || !url) {
    return NextResponse.json({ error: 'Name and URL are required' }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      name,
      url,
      description,
      createdBy: user.id,
    },
    include: { bugs: true },
  });

  return NextResponse.json(project, { status: 201 });
}
