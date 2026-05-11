// /api/cron/bug-reminders/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBugReminderEmail } from "@/lib/email/sendBugReminderEmail";
import { logAudit } from "@/lib/audit";

export async function GET(req: NextRequest) {

    console.log("🔥 BUG REMINDER CRON HIT");

    // 🔒 Protect route
    const authHeader = req.headers.get("authorization");

    if (
        authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {

        // 🐞 Fetch OPEN + RESOLVED bugs
        const bugs = await prisma.bug.findMany({
            where: {
                status: {
                    in: ["OPEN", "RESOLVED"],
                },
            },

            include: {
                project: {
                    include: {
                        user: true,
                    },
                },
            },

            orderBy: {
                createdAt: "desc",
            },
        });

        console.log(`🐞 Found ${bugs.length} bugs`);

        if (!bugs.length) {

            return NextResponse.json({
                success: true,
                message: "No bugs found",
            });
        }

        // 📦 Group by OWNER + PROJECT
        const grouped = bugs.reduce((acc, bug) => {

            const owner = bug.project.user;
            const project = bug.project;

            const key = `${owner.email}:${project.id}`;

            if (!acc[key]) {
                acc[key] = {
                    owner,
                    project,
                    bugs: [],
                };
            }

            acc[key].bugs.push(bug);

            return acc;

        }, {} as Record<string, any>);

        const sentEmails: string[] = [];

        // 📧 Send emails
        for (const key in grouped) {

            const group = grouped[key];

            const openBugs = group.bugs.filter(
                (bug: any) => bug.status === "OPEN"
            );

            const resolvedBugs = group.bugs.filter(
                (bug: any) => bug.status === "RESOLVED"
            );

            await sendBugReminderEmail({
                receiverEmail: group.owner.email,
                receiverName: group.owner.name ?? "there",

                projectName: group.project.name ?? "your project",

                openBugs: openBugs.map((bug: any) => ({
                    id: bug.id,
                    title: bug.title,
                })),

                resolvedBugs: resolvedBugs.map((bug: any) => ({
                    id: bug.id,
                    title: bug.title,
                })),
            });

            sentEmails.push(group.owner.email);

            // 📝 Audit log
            await logAudit({
                actorSnapshot: {
                    type: "system",
                    name: "CRON_JOB",
                    job: "BUG_REMINDER",
                },

                actorId: "SYSTEM",

                ownerId: group.owner.id,

                ownerSnapshot: {
                    id: group.owner.id,
                    name: group.owner.name,
                    email: group.owner.email,
                },

                projectId: group.project.id,

                action: "CRON_BUG_REMINDER_SENT",

                entityType: "system_job",

                entityId: group.owner.email,

                metadata: {
                    projectId: group.project.id,
                    projectName: group.project.name,

                    openBugCount: openBugs.length,
                    resolvedBugCount: resolvedBugs.length,

                    bugIds: group.bugs.map((b: any) => b.id),

                    runAt: new Date().toISOString(),
                },

                req,
            });
        }

        return NextResponse.json({
            success: true,
            emailsSent: sentEmails.length,
            emails: sentEmails,
        });

    } catch (error) {

        console.error("❌ CRON ERROR:", error);

        return NextResponse.json(
            {
                error: "Internal server error",
            },
            {
                status: 500,
            }
        );
    }
}