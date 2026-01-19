// app/api/projects/[id]/bugs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';


interface RouteParams {
  params: Promise<{ id: string }>;
}


function uploadToCloudinary(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "bugs" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      }
    );

    stream.end(buffer);
  });
}


export async function POST(req: NextRequest, { params }: RouteParams) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const projectId = parseInt(id, 10);
  if (isNaN(projectId))
    return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });

  const formData = await req.formData();
  const title = formData.get('title') as string;
  const severity = formData.get('severity') as string;
  const description = formData.get('description') as string;
  const file = formData.get('screenshot') as File | null;

  if (!title || !severity)
    return NextResponse.json({ error: 'Title and severity required' }, { status: 400 });

  // Create bug first
  const bug = await prisma.bug.create({
    data: {
      title,
      severity,
      description,
      projectId,
      createdBy: user.id,
    },
  });

  // If file exists, create screenshot linked to bug
  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const screenshotUrl = await uploadToCloudinary(buffer);

    await prisma.screenshot.create({
      data: {
        url: screenshotUrl,
        bugId: bug.id,
      },
    });
  }

  // Return bug including screenshots
  const bugWithScreenshots = await prisma.bug.findUnique({
    where: { id: bug.id },
    include: { screenshots: true },
  });


  return NextResponse.json(bugWithScreenshots, { status: 201 });
}
