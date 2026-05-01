import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { sendAdminNotification } from '@/lib/email/AdminNotificationEmailProps';
import slugify from 'slugify';
import { createSupabaseServer } from '@/lib/supabaseServer';

export async function GET(req: NextRequest) {

  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { auth_id: user.id }
  })

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const whereClause = dbUser.role === 'ADMIN' ?
    {} :
    { createdBy: dbUser.id };


  const projects = await prisma.project.findMany({
    where: whereClause,
    include: { bugs: true }, // include bug reports
  });

  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {

  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, url, description } = await req.json();

  const slug = slugify(name, { lower: true });
  if (!name || !url) {
    return NextResponse.json({ error: 'Name and URL are required' }, { status: 400 });
  }

  let dbUser = await prisma.user.findUnique({
    where: { auth_id: user.id }
  })

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const project = await prisma.project.create({
    data: {
      name,
      url,
      slug,
      description,
      createdBy: dbUser.id,
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