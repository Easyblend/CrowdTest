// app/api/projects/[id]/bugs/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { sendBugReport } from "@/lib/email/sendBugReport";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { logAudit } from "@/lib/audit";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function uploadToCloudinary(
  buffer: Buffer
): Promise<{ url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "bugs" },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          url: result!.secure_url,
          public_id: result!.public_id,
        });
      }
    );

    stream.end(buffer);
  });
}

/* ---------------- CREATE BUG ---------------- */
export async function POST(req: NextRequest, { params }: RouteParams) {
  const supabase = await createSupabaseServer(req);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { auth_id: user.id },
  });

  if (!dbUser)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { id } = await params;
  const projectId = String(id);

  if (!projectId)
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });

  const formData = await req.formData();
  const title = formData.get("title") as string;
  const severity = formData.get("severity") as string;
  const description = formData.get("description") as string;
  const file = formData.get("screenshot") as File | null;

  if (!title || !severity)
    return NextResponse.json(
      { error: "Title and severity required" },
      { status: 400 }
    );

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { user: true },
  });

  if (!project)
    return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const canReport =
    dbUser.role === "ADMIN" || project.createdBy === dbUser.id;

  if (!canReport)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // -------------------------------
  // 🔥 1. UPLOAD FIRST (FAIL FAST)
  // -------------------------------
  let upload: { url: string; public_id: string } | null = null;

  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    upload = await uploadToCloudinary(buffer);
  }

  // -------------------------------
  // 🐞 2. CREATE BUG ONLY IF UPLOAD OK
  // -------------------------------
  const bug = await prisma.bug.create({
    data: {
      title,
      severity,
      description,
      projectId,
      createdBy: dbUser.id,
    },
  });

  // -------------------------------
  // 🖼 3. SAVE SCREENSHOT
  // -------------------------------
  if (upload) {
    try {
      await prisma.screenshot.create({
        data: {
          url: upload.url,
          public_id: upload.public_id,
          bugId: bug.id,
        },
      });
    } catch (error) {
      // If saving screenshot fails, delete the uploaded image to avoid orphaned files
      await cloudinary.uploader.destroy(upload.public_id);
      // Also delete the created bug since we couldn't save the screenshot
      await prisma.bug.delete({ where: { id: bug.id } });
      return NextResponse.json({ error: "Failed to save screenshot" }, { status: 500 });
    }
  }

  await prisma.project.update({
    where: { id: projectId },
    data: { lastActivityAt: new Date(), status: "ACTIVE" },
  });

  // -------------------------------
  // 📊 4. AUDIT
  // -------------------------------
  await logAudit({
    actorId: dbUser.id,
    actorSnapshot: {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
    },

    ownerId: project.createdBy,
    ownerSnapshot: project.user
      ? {
        id: project.user.id,
        name: project.user.name,
        email: project.user.email,
        role: project.user.role,
      }
      : null,

    projectId: project.id,

    action: "BUG_CREATED",
    entityType: "bug",
    entityId: bug.id,

    metadata: {
      title,
      severity,
      description,
      project: {
        id: project.id,
        name: project.name,
      },
      screenshot: upload?.url ?? null,
    },

    req,
  });

  // -------------------------------
  // 📧 5. EMAIL
  // -------------------------------
  sendBugReport({
    receiverEmail: project.user.email,
    projectId: project.id,
    projectName: project.name,
    receiverName: project.user.name ?? "there",
    bugTitle: bug.title,
    bugDescription: bug.description,
    severity: bug.severity,
    screenshotUrl: upload?.url,
  }).catch(console.error);

  const bugWithScreenshots = await prisma.bug.findUnique({
    where: { id: bug.id },
    include: { screenshots: true },
  });

  return NextResponse.json(bugWithScreenshots, { status: 201 });
}