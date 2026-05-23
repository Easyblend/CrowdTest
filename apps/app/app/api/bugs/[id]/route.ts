// app/api/bugs/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { logAudit } from "@/lib/audit";
import cloudinary from "@/lib/cloudinary";
import { BugStatus } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/* ---------------- GET BUG ---------------- */
export async function GET(req: NextRequest, { params }: RouteParams) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const dbUser = await prisma.user.findUnique({
    where: { auth_id: user.id },
  });

  if (!dbUser)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const bug = await prisma.bug.findUnique({
    where: { id },
    include: {
      project: true,
      screenshots: true,
    },
  });

  if (!bug)
    return NextResponse.json({ error: "Bug not found" }, { status: 404 });

  const canView =
    dbUser.role === "ADMIN" ||
    bug.project.createdBy === dbUser.id ||
    bug.createdBy === dbUser.id;

  if (!canView)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json({
    ...bug,
    status: bug.status ?? "OPEN",
  });
}

/* ---------------- UPDATE BUG ---------------- */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const dbUser = await prisma.user.findUnique({
    where: { auth_id: user.id },
  });

  if (!dbUser)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const bug = await prisma.bug.findUnique({
    where: { id },
    include: {
      project: {
        include: {
          user: true, // 👈 owner already here
        }
      },
      screenshots: true,
    }
  });

  if (!bug)
    return NextResponse.json({ error: "Bug not found" }, { status: 404 });

  const canUpdate =
    dbUser.role === "ADMIN" ||
    bug.project.createdBy === dbUser.id ||
    bug.createdBy === dbUser.id;

  if (!canUpdate)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();

  const updateData: any = {};
  if (body.title !== undefined) updateData.title = body.title;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.severity !== undefined) updateData.severity = body.severity;

  // ✅ NEW: status handling
if (body.status && Object.values(BugStatus).includes(body.status)) {
  updateData.status = body.status;
}

  const updated = await prisma.bug.update({
    where: { id },
    data: updateData,
  });

  await prisma.project.update({
  where: { id: bug.projectId },
  data: { lastActivityAt: new Date(), status: "ACTIVE" }, // Update last activity and set project to ACTIVE when a bug is updated
});

  await logAudit({
    actorId: dbUser.id,
    ownerId: bug.project.createdBy,   // project owner
    actorSnapshot: {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
    },
    ownerSnapshot: bug.project.user
      ? {
        id: bug.project.user.id,
        name: bug.project.user.name,
        email: bug.project.user.email,
        role: bug.project.user.role,
      }
      : null,
    projectId: bug.projectId,
    action: "BUG_UPDATED",
    entityType: "bug",
    entityId: id,
    metadata: updateData,
    req,
  });

  return NextResponse.json(updated);
}

/* ---------------- DELETE BUG ---------------- */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const dbUser = await prisma.user.findUnique({
    where: { auth_id: user.id },
  });

  if (!dbUser)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const bug = await prisma.bug.findUnique({
    where: { id },
    include: {
      project: {
        include: {
          user: true, // 👈 owner already here
        }
      },
      screenshots: true,
    },
  });

  if (!bug)
    return NextResponse.json({ error: "Bug not found" }, { status: 404 });

  const canDelete =
    dbUser.role === "ADMIN" ||
    bug.project.createdBy === dbUser.id;

  if (!canDelete)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  /* ---------------- DELETE CLOUDINARY IMAGES ---------------- */
  if (bug.screenshots.length) {
    await Promise.all(
      bug.screenshots.map((s) =>
        s.public_id
          ? cloudinary.uploader.destroy(s.public_id).catch(console.error)
          : null
      )
    );
  }

  /* ---------------- DELETE DB ---------------- */
  await prisma.screenshot.deleteMany({
    where: { bugId: id },
  });

  await prisma.bug.delete({
    where: { id },
  });

  await prisma.project.update({
  where: { id: bug.projectId },
  data: { lastActivityAt: new Date(), status: "ACTIVE" }, // Update last activity and set project to ACTIVE when a bug is deleted
});

  await logAudit({
    actorId: dbUser.id,
    actorSnapshot: {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
    },

    ownerId: bug.project.createdBy,
    ownerSnapshot: bug.project.user
      ? {
        id: bug.project.user.id,
        name: bug.project.user.name,
        email: bug.project.user.email,
        role: bug.project.user.role,
      }
      : null,
    projectId: bug.projectId,

    action: "BUG_DELETED",
    entityType: "bug",
    entityId: id,

    metadata: {
      screenshotCount: bug.screenshots.length,
    },

    req,
  });

  return NextResponse.json({ message: "Bug deleted successfully" });
}