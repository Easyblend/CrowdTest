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

    inProgressBugs: {
        id: string;
        title: string;
    }[];
}

export async function sendBugReminderEmail({
    receiverEmail,
    receiverName,
    projectName,
    openBugs,
    inProgressBugs,
}: Props) {

    const totalBugs =
        openBugs.length + inProgressBugs.length;

    try {

        const result = await transporter.sendMail({

            from: `"${projectName} via CrowdTest" <${process.env.EMAIL_SENDER}>`,

            to: receiverEmail,

            subject:
                `🚨 ${totalBugs} active bug${totalBugs !== 1 ? "s" : ""} need attention in ${projectName}`,

            html: buildEmail({
                receiverName,
                projectName,
                openBugs,
                inProgressBugs,
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
    inProgressBugs,
}: {
    receiverName: string;
    projectName: string;

    openBugs: {
        id: string;
        title: string;
    }[];

    inProgressBugs: {
        id: string;
        title: string;
    }[];
}) {

    const totalBugs =
        openBugs.length + inProgressBugs.length;

    return `
    <div style="
      background:#f6f7fb;
      padding:40px 0;
      font-family:Arial,sans-serif;
    ">

      <div style="
        max-width:600px;
        margin:0 auto;
        background:#ffffff;
        border-radius:16px;
        overflow:hidden;
        border:1px solid #e5e7eb;
      ">

        <!-- HEADER -->
        <div style="
          background:#4f46e5;
          padding:28px;
          text-align:center;
          color:#fff;
        ">

          <h1 style="
            margin:0;
            font-size:24px;
            font-weight:700;
          ">
            ${escapeHtml(projectName)}
          </h1>

          <p style="
            margin:8px 0 0;
            font-size:13px;
            opacity:0.9;
          ">
            CrowdTest Bug Activity Report
          </p>

        </div>

        <!-- BODY -->
        <div style="padding:32px;">

          <h2 style="
            margin-top:0;
            margin-bottom:10px;
            color:#111827;
            font-size:22px;
          ">
            Hi ${escapeHtml(receiverName)} 👋
          </h2>

          <p style="
            font-size:14px;
            color:#4b5563;
            line-height:1.7;
            margin-top:0;
          ">
            Your project
            <strong>${escapeHtml(projectName)}</strong>
            currently has
            <strong>${totalBugs} active bug${totalBugs !== 1 ? "s" : ""}</strong>
            that may require attention.
          </p>

          <!-- SUMMARY -->
          <div style="
            margin-top:28px;
            padding:18px;
            background:#f9fafb;
            border:1px solid #e5e7eb;
            border-radius:12px;
          ">

            <div style="
              font-size:14px;
              color:#111827;
              font-weight:600;
              margin-bottom:14px;
            ">
              Current Project Health
            </div>

            <div style="
              display:flex;
              gap:12px;
            ">

              <!-- OPEN -->
              <div style="
                flex:1;
                background:#fff7ed;
                border-radius:10px;
                padding:14px;
                text-align:center;
                border:1px solid #fdba74;
              ">

                <div style="
                  font-size:24px;
                  font-weight:700;
                  color:#ea580c;
                ">
                  ${openBugs.length}
                </div>

                <div style="
                  margin-top:4px;
                  font-size:12px;
                  color:#9a3412;
                ">
                  Open Bugs
                </div>

              </div>

              <!-- IN PROGRESS -->
              <div style="
                flex:1;
                background:#fefce8;
                border-radius:10px;
                padding:14px;
                text-align:center;
                border:1px solid #fde047;
              ">

                <div style="
                  font-size:24px;
                  font-weight:700;
                  color:#ca8a04;
                ">
                  ${inProgressBugs.length}
                </div>

                <div style="
                  margin-top:4px;
                  font-size:12px;
                  color:#854d0e;
                ">
                  In Progress
                </div>

              </div>

            </div>

          </div>

          ${openBugs.length > 0
            ? `
            <!-- OPEN BUGS -->
            <div style="margin-top:36px;">

              <h3 style="
                margin-bottom:10px;
                color:#111827;
                font-size:18px;
              ">
                🟠 Open Bugs (${openBugs.length})
              </h3>

              <p style="
                margin-top:0;
                font-size:13px;
                color:#6b7280;
                line-height:1.6;
              ">
                These bugs are unresolved and may require investigation,
                prioritization, or fixes.
              </p>

              ${openBugs
                .map(
                    (bug) => `
                    <div style="
                      padding:14px 16px;
                      margin-bottom:12px;
                      background:#fff7ed;
                      border:1px solid #fdba74;
                      border-radius:10px;
                    ">

                      <div style="
                        font-size:14px;
                        color:#111827;
                        font-weight:600;
                      ">
                        🐞 ${escapeHtml(bug.title)}
                      </div>

                    </div>
                  `
                )
                .join("")}

            </div>
          `
            : ""
        }

          ${inProgressBugs.length > 0
            ? `
            <!-- IN PROGRESS BUGS -->
            <div style="margin-top:36px;">

              <h3 style="
                margin-bottom:10px;
                color:#111827;
                font-size:18px;
              ">
                🟡 In-Progress Bugs (${inProgressBugs.length})
              </h3>

              <p style="
                margin-top:0;
                font-size:13px;
                color:#6b7280;
                line-height:1.6;
              ">
                These bugs are currently marked as in progress and may still require attention. Are they actively being worked on?
              </p>

              ${inProgressBugs
                .map(
                    (bug) => `
                    <div style="
                      padding:14px 16px;
                      margin-bottom:12px;
                      background:#fefce8;
                      border:1px solid #fde047;
                      border-radius:10px;
                    ">

                      <div style="
                        font-size:14px;
                        color:#111827;
                        font-weight:600;
                      ">
                        🐞 ${escapeHtml(bug.title)}
                      </div>

                    </div>
                  `
                )
                .join("")}

            </div>
          `
            : ""
        }

          <!-- CTA -->
          <div style="
            margin-top:40px;
            text-align:center;
          ">

            <a
              href="${process.env.SITE_URL}/dashboard"
              style="
                display:inline-block;
                background:#4f46e5;
                color:#ffffff;
                padding:14px 24px;
                border-radius:10px;
                text-decoration:none;
                font-weight:600;
                font-size:14px;
              "
            >
              Review Active Bugs
            </a>

          </div>

        </div>

        <!-- FOOTER -->
        <div style="
          padding:24px;
          font-size:12px;
          color:#9ca3af;
          text-align:center;
          border-top:1px solid #e5e7eb;
          background:#fafafa;
        ">

          <div>
            You’re receiving this because you own the project
            <strong>${escapeHtml(projectName)}</strong>.
          </div>

          <div style="
            margin-top:8px;
            font-size:11px;
            color:#9ca3af;
          ">
            Manage notification preferences in your dashboard.
          </div>

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