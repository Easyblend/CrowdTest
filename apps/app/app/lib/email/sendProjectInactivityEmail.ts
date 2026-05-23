import { transporter } from "./transporter";
import { escapeHtml } from "./sendBugReminderEmail";

type Level = "week1" | "week2" | "week3";

interface Props {
  email: string;
  name?: string;
  projectName: string;
  level: Level;
  bugCount: number;
  lastActivityAt: Date;
}

export async function sendProjectInactivityEmail({
  email,
  name,
  projectName,
  level,
  bugCount,
  lastActivityAt,
}: Props) {
  const templates = {
    week1: {
      title: "Your project is waiting for attention",
      color: "#f59e0b",
      message:
        "No recent activity detected. Your testers are still waiting for updates.",
    },

    week2: {
      title: "Your project is inactive for 2 weeks",
      color: "#f97316",
      message:
        "Activity has dropped significantly. Open bugs may be going unattended. Please review your project.",
    },

    week3: {
      title: "Your project has been archived",
      color: "#ef4444",
      message:
        "Extended inactivity detected. Your project has been archived. to restore it, please contact support and review your project to reactivate it.",
    },
  };

  const t = templates[level];

  const html = `
    <div style="background:#f6f7fb;padding:40px 0;font-family:Arial;">

      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">

        <!-- HEADER (same structure as bug email) -->
        <div style="background:${t.color};padding:24px;text-align:center;color:#fff;">
          <h1 style="margin:0;font-size:20px;">
            ${escapeHtml(projectName)}
          </h1>
          <p style="margin:6px 0 0;font-size:13px;">
            Project Health Alert
          </p>
        </div>

        <!-- BODY -->
        <div style="padding:32px;">

          <h2 style="margin-top:0;">
            Hi ${escapeHtml(name ?? "there")} 👋
          </h2>

          <!-- ALERT BLOCK (same position as bug sections) -->
          <div style="
            background:#fff7ed;
            border:1px solid ${t.color};
            padding:14px;
            border-radius:8px;
            margin:20px 0;
          ">
            ⚠️ ${t.message}
          </div>

          <!-- SUMMARY BLOCK -->
          <div style="font-size:14px;color:#4b5563;line-height:1.6;">
            <p>
              <strong>${escapeHtml(projectName)}</strong> has had no recent activity.
            </p>

            <p>
              Current bug count: <strong>${bugCount}</strong>
            </p>

            <p>
              Last activity: ${new Date(lastActivityAt).toDateString()}
            </p>
          </div>

          <!-- CTA (same as bug email) -->
          <div style="margin-top:30px;text-align:center;">
            <a href="${process.env.SITE_URL}/dashboard"
              style="
                background:#4f46e5;
                color:#fff;
                padding:12px 20px;
                border-radius:8px;
                text-decoration:none;
                font-weight:600;
              ">
              Review Project
            </a>
          </div>

        </div>

        <!-- FOOTER (same as bug email) -->
        <div style="padding:20px;text-align:center;font-size:12px;color:#9ca3af;">
          You're receiving this because you own ${escapeHtml(projectName)}.
        </div>

      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"CrowdTest" <${process.env.EMAIL_SENDER}>`,
    to: email,
    subject: `⚠️ ${projectName} inactivity alert`,
    html,
  });
}