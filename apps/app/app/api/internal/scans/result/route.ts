import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendScanReport } from "@/lib/email/ScanReportEmail";

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get("authorization");

    if (
        authHeader !==
        `Bearer ${process.env.SCANNER_API_KEY}`
    ) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const result = await req.json();

        /*
         * Validate required scan information
         */
        if (!result.scanId || !result.projectId) {
            return NextResponse.json(
                {
                    error: "Missing scan information",
                },
                { status: 400 }
            );
        }

        /*
         * Find the project and owner.
         *
         * The scanner does NOT need to send:
         * - receiverEmail
         * - projectName
         * - projectUrl
         *
         * We already have that information in our database.
         */
        const project = await prisma.project.findUnique({
            where: {
                id: result.projectId,
            },
            include: {
                user: true,
            },
        });

        if (!project) {
            return NextResponse.json(
                {
                    error: "Project not found",
                },
                { status: 404 }
            );
        }

        /*
         * Scanner reported a failed scan
         */
        if (!result.success) {
            await prisma.scan.update({
                where: {
                    id: result.scanId,
                },
                data: {
                    status: "FAILED",
                    error:
                        result.error ??
                        "Unknown scan error",
                    completedAt: new Date(),
                },
            });

            return NextResponse.json({
                success: true,
            });
        }

        /*
         * Normalize findings
         */
        const findings = result.findings ?? [];

        /*
         * Save automated findings
         */
        if (findings.length > 0) {
            await prisma.automatedFinding.createMany({
                data: findings.map(
                    (finding: any) => ({
                        scanId: result.scanId,
                        projectId: result.projectId,

                        category:
                            finding.category,
                        severity:
                            finding.severity,
                        confidence:
                            finding.confidence,

                        url: finding.url,
                        description:
                            finding.description,

                        request:
                            finding.request ??
                            null,

                        statusCode:
                            finding.statusCode ??
                            null,

                        error:
                            finding.error ??
                            null,

                        stack:
                            finding.stack ??
                            null,
                    })
                ),
            });
        }

        /*
         * Mark scan as completed
         */
        await prisma.scan.update({
            where: {
                id: result.scanId,
            },
            data: {
                status: "COMPLETED",

                pagesScanned:
                    result.pagesScanned ?? 0,

                findingsCount:
                    findings.length,

                completedAt: new Date(),
            },
        });

        /*
         * Send automated scan report
         *
         * Email failure must NOT cause
         * the scan itself to become FAILED.
         */
        try {
            await sendScanReport({
                receiverEmail:
                    project.user.email,

                projectId:
                    project.id,

                projectName:
                    project.name,

                projectUrl:
                    project.url,

                pagesScanned:
                    result.pagesScanned ?? 0,

                findings: findings.map(
                    (finding: any) => ({
                        category:
                            finding.category,

                        severity:
                            finding.severity,

                        confidence:
                            finding.confidence,

                        url: finding.url,

                        description:
                            finding.description,

                        request:
                            finding.request,

                        statusCode:
                            finding.statusCode,

                        error:
                            finding.error,
                    })
                ),
            });
        } catch (emailError) {
            console.error(
                "Failed to send scan report email:",
                emailError
            );
        }

        /*
         * Everything related to the scan itself
         * succeeded.
         */
        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(
            "Failed to process scan result:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Failed to process scan result",
            },
            {
                status: 500,
            }
        );
    }
}