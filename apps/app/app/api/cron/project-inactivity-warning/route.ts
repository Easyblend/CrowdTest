import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { sendProjectInactivityEmail } from "@/lib/email/sendProjectInactivityEmail";

export async function GET(req: NextRequest) {
    console.log("🔥 PROJECT INACTIVITY CRON HIT");

    // 🔒 protect cron
    const authHeader = req.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const now = new Date();
        const DAY = 24 * 60 * 60 * 1000;

        // 🧠 only projects with real bug activity relevance
        const projects = await prisma.project.findMany({
            where: {
                bugs: {
                    some: {
                        status: {
                            in: ["OPEN", "IN_PROGRESS"],
                        },
                    },
                },
                status: "ACTIVE",
            },
            include: {
                user: true,
                bugs: true,
            },
        });

        console.log(`📦 Found ${projects.length} projects`);

        const week1: typeof projects = [];
        const week2: typeof projects = [];
        const week3: typeof projects = [];

        for (const project of projects) {
            const diff = now.getTime() - project.lastActivityAt.getTime();

            // WEEK 1
            if (diff >= 7 * DAY && diff < 14 * DAY) {
                week1.push(project);

                await prisma.project.update({
                    where: { id: project.id },
                    data: { status: "INACTIVE" },
                });
            }

            // WEEK 2
            else if (diff >= 14 * DAY && diff < 21 * DAY) {
                week2.push(project);
            }

            // WEEK 3
            else if (diff >= 21 * DAY) {
                week3.push(project);

                await prisma.project.update({
                    where: { id: project.id },
                    data: { status: "ARCHIVED" },
                });
            }
        }

        const sent: string[] = [];

        // 🟡 WEEK 1
        for (const project of week1) {
            await sendProjectInactivityEmail({
                email: project.user.email,
                name: project.user.name,
                projectName: project.name,
                level: "week1",
                bugCount: project.bugs.length,
                lastActivityAt: project.lastActivityAt,
            });

            sent.push(project.id);
        }

        // 🟠 WEEK 2
        for (const project of week2) {
            await sendProjectInactivityEmail({
                email: project.user.email,
                name: project.user.name,
                projectName: project.name,
                level: "week2",
                bugCount: project.bugs.length,
                lastActivityAt: project.lastActivityAt,
            });

            sent.push(project.id);
        }

        // 🔴 WEEK 3
        for (const project of week3) {
            await sendProjectInactivityEmail({
                email: project.user.email,
                name: project.user.name,
                projectName: project.name,
                level: "week3",
                bugCount: project.bugs.length,
                lastActivityAt: project.lastActivityAt,
            });

            sent.push(project.id);
        }

        // 📊 audit log (batch style)
        await logAudit({
            actorId: "SYSTEM",
            actorSnapshot: {
                type: "CRON",
                job: "PROJECT_INACTIVITY_WARNING",
            },
            action: "CRON_PROJECT_INACTIVITY_EMAIL_SENT",
            entityType: "system_job",
            entityId: "project-inactivity-cron",
            metadata: {
                week1: week1.length,
                week2: week2.length,
                week3: week3.length,
                total: sent.length,
            },
            req,
        });

        return NextResponse.json({
            success: true,
            sent: sent.length,
            emailedProjects: sent,
            details: {
                week1: week1.map((p) => ({
                    id: p.id,
                    name: p.name,
                    link: `${process.env.SITE_URL}/projects/${p.id}`,
                    ownerEmail: p.user.email,
                })),
                week2: week2.map((p) => ({
                    id: p.id,
                    name: p.name,
                    link: `${process.env.SITE_URL}/projects/${p.id}`,
                    ownerEmail: p.user.email,
                })),
                week3: week3.map((p) => ({
                    id: p.id,
                    name: p.name,
                    link: `${process.env.SITE_URL}/projects/${p.id}`,
                    ownerEmail: p.user.email,
                })),
            },

        });
    } catch (error) {
        console.error("❌ CRON ERROR:", error);

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}