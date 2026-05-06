// app/api/bugs/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { logAudit } from "@/lib/audit";
import cloudinary from "@/lib/cloudinary";

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

  return NextResponse.json(bug);
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
    include: { project: true },
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
  if (body.resolved !== undefined) updateData.resolved = body.resolved;

  const updated = await prisma.bug.update({
    where: { id },
    data: updateData,
  });

  await logAudit({
    userId: dbUser.id,
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
      project: true,
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

  await logAudit({
    userId: dbUser.id,
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