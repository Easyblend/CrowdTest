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

                // 🚨 Only fetch bugs whose project has a valid owner
                project: {
                    user: {
                        id: {
                            not: "",
                        },
                    },
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

        // 🧠 Strong typing
        type GroupedBugs = Record<
            string,
            {
                owner: NonNullable<
                    typeof bugs[number]["project"]["user"]
                >;

                project: typeof bugs[number]["project"];

                bugs: typeof bugs[number][];
            }
        >;

        // 📦 Group by OWNER + PROJECT
        const grouped = bugs.reduce<GroupedBugs>((acc, bug) => {

            // 🚨 Runtime safety
            if (!bug.project || !bug.project.user) {

                console.warn(
                    `⚠️ Skipping bug ${bug.id} because project/user relation is missing`
                );

                return acc;
            }

            const owner = bug.project.user;
            const project = bug.project;

            // 🚨 Extra safety
            if (!owner.email) {

                console.warn(
                    `⚠️ Skipping bug ${bug.id} because owner email is missing`
                );

                return acc;
            }

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

        }, {});

        const sentEmails: string[] = [];

        // 📧 Send emails
        for (const key in grouped) {

            const group = grouped[key];

            const openBugs = group.bugs.filter(
                (bug) => bug.status === "OPEN"
            );

            const resolvedBugs = group.bugs.filter(
                (bug) => bug.status === "RESOLVED"
            );

            await sendBugReminderEmail({
                receiverEmail: group.owner.email,

                receiverName:
                    group.owner.name ?? "there",

                projectName:
                    group.project.name ?? "your project",

                openBugs: openBugs.map((bug) => ({
                    id: bug.id,
                    title: bug.title,
                })),

                resolvedBugs: resolvedBugs.map((bug) => ({
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

                    projectName:
                        group.project.name,

                    openBugCount:
                        openBugs.length,

                    resolvedBugCount:
                        resolvedBugs.length,

                    bugIds: group.bugs.map(
                        (b) => b.id
                    ),

                    runAt: new Date().toISOString(),
                },

                req,
            });
        }

        return NextResponse.json({
            success: true,
            emailsSent: sentEmails.length,
            emails: sentEmails,
            details: Object.values(grouped).map((group) => ({
                ownerEmail: group.owner.email,
                projectId: group.project.id,
                projectName: group.project.name,
                link: `${process.env.SITE_URL}/projects/${group.project.id}/bugs`,
                buglist: group.bugs.map((b) => ({
                    id: b.id,
                    title: b.title,
                    status: b.status,
                })),
                openBugCount: group.bugs.filter(
                    (b) => b.status === "OPEN"
                ).length,
                resolvedBugCount: group.bugs.filter(
                    (b) => b.status === "RESOLVED"
                ).length,
            })),
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