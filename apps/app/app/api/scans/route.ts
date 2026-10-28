import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scanWebsite } from "@/lib/scanner/scanner";
import { sendScanReport } from "@/lib/email/ScanReportEmail";

export const maxDuration = 300;

export async function POST(request: NextRequest) {

  try {
    const body = await request.json();

    const { projectId } = body;

    if (!projectId || typeof projectId !== "string") {
      return NextResponse.json(
        {
          error: "A valid projectId is required.",
        },
        {
          status: 400,
        }
      );
    }

    // Find project and owner
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        user: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        {
          error: "Project not found.",
        },
        {
          status: 404,
        }
      );
    }

    const url = project.url;

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        {
          error: "Project contains an invalid URL.",
        },
        {
          status: 400,
        }
      );
    }

    console.log(
      `🔍 Scan requested for project ${projectId}: ${url}`
    );

    // Run scanner
    const result = await scanWebsite(url);

    // Persist automated findings
    if (result.findings.length > 0) {
      await prisma.automatedFinding.createMany({
        data: result.findings.map((finding) => ({
          projectId: project.id,
          category: finding.category,
          severity: finding.severity,
          confidence: finding.confidence,
          url: finding.url,
          description: finding.description,
          request: finding.evidence.request,
          statusCode: finding.evidence.statusCode,
          error: finding.evidence.error,
          stack: finding.evidence.stack,
        })),
      });
    }

    console.log(
      `💾 Saved ${result.findings.length} automated findings`
    );

    // Send scan report to project owner
    await sendScanReport({
      receiverEmail: project.user.email,
      projectId: project.id,
      projectName: project.name,
      projectUrl: project.url,
      pagesScanned: result.pagesScanned,
      findings: result.findings.map((finding) => ({
        category: finding.category,
        severity: finding.severity,
        confidence: finding.confidence,
        url: finding.url,
        description: finding.description,
        request: finding.evidence.request,
        statusCode: finding.evidence.statusCode,
        error: finding.evidence.error,
      })),
    });

    console.log(
      `📧 Scan report sent to ${project.user.email}`
    );

    return NextResponse.json({
      success: true,
      projectId: project.id,
      url,
      ...result,
    });
  } catch (error) {
    console.error("Scanner error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Scanner failed.",
      },
      {
        status: 500,
      }
    );
  }
}