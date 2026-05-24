import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';
import { createSupabaseServer } from '@/lib/supabaseServer';
import { logAudit } from '@/lib/audit';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const supabase = await createSupabaseServer(req);

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
/* ---------------- UPDATE PROJECT ---------------- */
export async function PATCH(req: NextRequest, { params }: RouteParams) {

  const supabase = await createSupabaseServer(req);

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

  const updatedData: any = {};

  updatedData.lastActivityAt = new Date(); // Update last activity when project name changes
  updatedData.status =  "ACTIVE"; 
  if (data.name !== undefined) {
    updatedData.name = data.name;
    updatedData.slug = slugify(data.name, { lower: true, strict: true });
  }
  if (data.description !== undefined) updatedData.description = data.description;
  if (data.url !== undefined) updatedData.url = data.url;

  let dbUser = await prisma.user.findUnique({
    where: { auth_id: user.id }
  })

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const whereClause = dbUser.role === 'ADMIN' ?
    { id: projectId } :
    { id: projectId, createdBy: dbUser.id };

  const updatedProject = await prisma.project.update({
    where: whereClause,
    data: updatedData,
    include: { user: true },
  });

  if (!updatedProject) return NextResponse.json({ error: 'Project not found or not yours' }, { status: 404 });



  await logAudit({
    actorId: dbUser.id,
    actorSnapshot: {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
    },
    ownerSnapshot: updatedProject.user
      ? {
        id: updatedProject.user.id,
        name: updatedProject.user.name,
        email: updatedProject.user.email,
        role: updatedProject.user.role,
      }
      : null,
    ownerId: updatedProject.createdBy,
    projectId: projectId,
    action: "PROJECT_UPDATED",
    entityType: "project",
    entityId: projectId,
    metadata: {
      changes: updatedData,
    },
    req,
  });

  return NextResponse.json(updatedProject);
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const supabase = await createSupabaseServer(req);

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

  const whereClause = dbUser.role === 'ADMIN'
    ? { id: projectId }
    : { id: projectId, createdBy: dbUser.id };

  const project = await prisma.project.findFirst({
    where: whereClause,
    include: { bugs: true, user: true },
  });

  const deleted = await prisma.project.deleteMany({
    where: whereClause,
  });

  if (deleted.count === 0) return NextResponse.json({ error: 'Project not found or not yours' }, { status: 404 });

  await logAudit({
    actorId: dbUser.id,
    actorSnapshot: {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
    },
    ownerSnapshot: project?.user
      ? {
        id: project.user.id,
        name: project.user.name,
        email: project.user.email,
        role: project.user.role,
      }
      : null,
    ownerId: project?.user?.id, // 👈 IMPORTANT FIX
    projectId: projectId,
    action: "PROJECT_DELETED",
    entityType: "project",
    entityId: projectId,
    metadata: {
      snapshot: {
        name: project?.name,
        url: project?.url,
        slug: project?.slug,
        bugCount: project?.bugs?.length ?? 0,
      },
      deletedByRole: dbUser.role,
      isAdminDelete: dbUser.role === "ADMIN",
    },
    req,
  });

  return NextResponse.json({ success: true });
}
