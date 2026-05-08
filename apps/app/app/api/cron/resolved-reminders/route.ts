import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendResolvedReminder } from "@/lib/email/sendResolvedReminder";

export async function GET(req: NextRequest) {

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

        // 🐞 Find resolved bugs
        const bugs = await prisma.bug.findMany({
            where: {
                status: "RESOLVED",
            },

            include: {
                project: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        // Nothing to send
        if (!bugs.length) {
            return NextResponse.json({
                success: true,
                message: "No resolved bugs found",
            });
        }

        // 📦 Group bugs by user email
        const grouped = bugs.reduce((acc, bug) => {

            const email = bug.project.user.email;

            if (!acc[email]) {
                acc[email] = {
                    user: bug.project.user,
                    bugs: [],
                };
            }

            acc[email].bugs.push(bug);

            return acc;

        }, {} as Record<string, any>);

        // 📧 Send emails
        for (const email in grouped) {

            const group = grouped[email];

            await sendResolvedReminder({
                receiverEmail: email,
                receiverName: group.user.name ?? "there",

                bugs: group.bugs.map((bug: any) => ({
                    id: bug.id,
                    title: bug.title,
                })),
            });
        }

        return NextResponse.json({
            success: true,
            emailsSent: Object.keys(grouped).length,
            emails: Object.keys(grouped),
        });

    } catch (error) {

        console.error(error);

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
