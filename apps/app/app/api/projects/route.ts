import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { sendAdminNotification } from '@/lib/email/AdminNotificationEmailProps';

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: { createdBy: user.id },
    include: { bugs: true }, // include bug reports
  });

  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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

  // Notify admin about the new project
  sendAdminNotification({
    subject: `New Project Submitted: ${project.name}`,
    message: `User (${user.email}) submitted a new project.\n\nProject Name: ${project.name}\nURL: ${project.url}`,
    link: `${process.env.SITE_URL}/admin/projects/${project.id}`, // optional link to admin dashboard
  }).catch(console.error);

  return NextResponse.json(project, { status: 201 });
}