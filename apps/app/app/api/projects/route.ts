import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAdminNotification } from '@/lib/email/AdminNotificationEmailProps';
import slugify from 'slugify';
import { createSupabaseServer } from '@/lib/supabaseServer';
import { logAudit } from '@/lib/audit';

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

/* ---------------- CREATE PROJECT ---------------- */
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
  dbUser = await prisma.user.create({
    data: {
      auth_id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || "Unnamed User",
      role: "DEV",
      lastActivityAt: new Date(),
      status: "ACTIVE",
    }
  })
}

  const project = await prisma.project.create({
    data: {
      name,
      url,
      slug,
      description,
      createdBy: dbUser.id,
    },
   include: {
  bugs: {
    select: {
      id: true,
      status: true,
    }
  }
}
  });

  await logAudit({
    actorId: dbUser.id,
    actorSnapshot: {
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
      id: dbUser.id,
    },
    ownerId: dbUser.id,
    ownerSnapshot: {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
    },

    projectId: project.id,

    action: "PROJECT_CREATED",
    entityType: "project",
    entityId: project.id,

    metadata: {
      snapshot: {
        name: project.name,
        url: project.url,
        slug: project.slug,
        description: project.description,
        bugCount: project.bugs?.length || 0,
      },
      createdByRole: dbUser.role,
    },

    req,
  });
  // // Notify admin about the new project
  sendAdminNotification({
    subject: `New Project Submitted: ${project.name}`,
    message: `User (${user.email}) submitted a new project.\n\nProject Name: ${project.name}\nURL: ${project.url}`,
    link: `${process.env.SITE_URL}/admin/projects/${project.id}`, // optional link to admin dashboard
  }).catch(console.error);

  return NextResponse.json(project, { status: 201 });
}