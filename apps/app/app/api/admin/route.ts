import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET(req: NextRequest) {

  const projects = await prisma.project.findMany({
    include: { bugs: true }, // include bug reports
  });

  return NextResponse.json(projects);
}

