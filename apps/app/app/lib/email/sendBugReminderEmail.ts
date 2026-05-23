// /lib/email/sendBugReminderEmail.ts

import { transporter } from "./transporter";

interface Props {
    receiverEmail: string;
    receiverName: string;

    projectName: string;

    openBugs: {
        id: string;
        title: string;
    }[];

    resolvedBugs: {
        id: string;
        title: string;
    }[];
}

export async function sendBugReminderEmail({
    receiverEmail,
    receiverName,
    projectName,
    openBugs,
    resolvedBugs,
}: Props) {

    const totalBugs =
        openBugs.length + resolvedBugs.length;

    try {

        const result = await transporter.sendMail({

            from: `"${projectName} via CrowdTest" <${process.env.EMAIL_SENDER}>`,

            to: receiverEmail,

            subject:
                `👋 ${receiverName}, ${projectName} has ${totalBugs} active bug updates`,

            html: buildEmail({
                receiverName,
                projectName,
                openBugs,
                resolvedBugs,
            }),
        });

        console.log("📧 EMAIL SENT:", result);

        return result;

    } catch (err) {

        console.error("❌ EMAIL FAILED:", err);

        throw err;
    }
}

function buildEmail({
    receiverName,
    projectName,
    openBugs,
    resolvedBugs,
}: {
    receiverName: string;
    projectName: string;

    openBugs: {
        id: string;
        title: string;
    }[];

    resolvedBugs: {
        id: string;
        title: string;
    }[];
}) {

    return `
    <div style="background:#f6f7fb;padding:40px 0;font-family:Arial,sans-serif;">

      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;">

        <!-- HEADER -->
        <div style="background:#4f46e5;padding:24px;text-align:center;color:#fff;">

          <h1 style="margin:0;font-size:22px;">
            ${escapeHtml(projectName)}
          </h1>

          <p style="margin:6px 0 0;font-size:13px;opacity:0.9;">
            CrowdTest Bug Activity
          </p>

        </div>

        <!-- BODY -->
        <div style="padding:32px;">

          <h2 style="margin-top:0;color:#111827;">
            Hi ${escapeHtml(receiverName)} 👋
          </h2>

          <p style="font-size:14px;color:#4b5563;line-height:1.7;">
            Here's a summary of the latest bug activity for
            <strong>${escapeHtml(projectName)}</strong>.
          </p>

          ${openBugs.length > 0
            ? `
                <!-- OPEN BUGS -->
                <div style="margin-top:32px;">

                  <h3 style="margin-bottom:10px;color:#111827;">
                    🟠 Open Bugs (${openBugs.length})
                  </h3>

                  <p style="
                    margin-top:0;
                    font-size:13px;
                    color:#6b7280;
                    line-height:1.6;
                  ">
                    These bugs are still open and may require fixes,
                    investigation, or prioritization.
                  </p>

                  ${openBugs
                .map(
                    (bug) => `
                            <div style="
                                padding:12px 15px;
                                margin-bottom:10px;
                                background:#fff7ed;
                                border:1px solid #fdba74;
                                border-radius:8px;
                                font-size:14px;
                                color:#111827;
                            ">
                                🐞 ${escapeHtml(bug.title)}
                            </div>
                        `
                )
                .join("")}

                </div>
            `
            : ""
        }

          ${resolvedBugs.length > 0
            ? `
                <!-- RESOLVED BUGS -->
                <div style="margin-top:32px;">

                  <h3 style="margin-bottom:10px;color:#111827;">
                    ✅ Resolved Bugs (${resolvedBugs.length})
                  </h3>

                  <p style="
                    margin-top:0;
                    font-size:13px;
                    color:#6b7280;
                    line-height:1.6;
                  ">
                    These bugs were marked as resolved and are ready
                    for verification and closure.
                  </p>

                  ${resolvedBugs
                .map(
                    (bug) => `
                            <div style="
                                padding:12px 15px;
                                margin-bottom:10px;
                                background:#ecfdf5;
                                border:1px solid #86efac;
                                border-radius:8px;
                                font-size:14px;
                                color:#111827;
                            ">
                                🐞 ${escapeHtml(bug.title)}
                            </div>
                        `
                )
                .join("")}

                </div>
            `
            : ""
        }

          <!-- CTA -->
          <div style="margin-top:36px;text-align:center;">

            <a
              href="${process.env.SITE_URL}/dashboard"
              style="
                display:inline-block;
                background:#4f46e5;
                color:#ffffff;
                padding:13px 22px;
                border-radius:8px;
                text-decoration:none;
                font-weight:600;
                font-size:14px;
              "
            >
              Open Dashboard
            </a>

          </div>

        </div>

        <!-- FOOTER -->
        <div style="
            padding:20px;
            font-size:12px;
            color:#9ca3af;
            text-align:center;
            border-top:1px solid #e5e7eb;
        ">
            You’re receiving this because you own
            the project <strong>${escapeHtml(projectName)}</strong>.
        </div>

      </div>

    </div>
    `;
}

export function escapeHtml(text: string) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}