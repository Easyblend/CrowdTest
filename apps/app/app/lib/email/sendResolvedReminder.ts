import { transporter } from "./transporter";

interface Props {
    receiverEmail: string;
    receiverName: string;
    projectName: string;

    bugs: {
        id: string;
        title: string;
    }[];
}

export async function sendResolvedReminder({
    receiverEmail,
    receiverName,
    bugs,
    projectName
}: Props) {

    try {

        const result = await transporter.sendMail({
            from: `"${projectName} via CrowdTest" <${process.env.EMAIL_SENDER}>`,
            to: receiverEmail,
            subject: `Review needed: ${projectName} (${bugs.length} resolved bugs)`,
            html: buildEmail({ receiverName, bugs }),
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
    bugs,
}: {
    receiverName: string;
    bugs: { id: string; title: string }[];
}) {

    return `
    <div style="background:#f6f7fb;padding:40px 0;font-family:Arial,sans-serif;">

      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;">

        <!-- HEADER -->
        <div style="background:#4f46e5;padding:20px;text-align:center;color:#fff;">
          <h1 style="margin:0;font-size:20px;">CrowdTest</h1>
          <p style="margin:5px 0 0;font-size:13px;opacity:0.9;">
            Bug Tracking Notifications
          </p>
        </div>

        <!-- BODY -->
        <div style="padding:30px;color:#111827;">

          <h2 style="margin-top:0;">
            Hello ${receiverName},
          </h2>

          <p style="font-size:14px;color:#4b5563;line-height:1.6;">
            The following bugs have been marked as <strong>resolved</strong>
            and are waiting for your verification and closure.
          </p>

          <!-- BUG LIST -->
          <div style="margin-top:20px;">
            ${bugs
                .map(
                    (bug) => `
                    <div style="
                        padding:12px 15px;
                        margin-bottom:10px;
                        background:#f9fafb;
                        border:1px solid #e5e7eb;
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

          <!-- CTA -->
          <div style="margin-top:25px;text-align:center;">
            <a href="${process.env.SITE_URL}/dashboard"
               style="
                display:inline-block;
                background:#4f46e5;
                color:#ffffff;
                padding:12px 20px;
                border-radius:6px;
                text-decoration:none;
                font-weight:600;
                font-size:14px;
               ">
              Review Bugs
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
            You’re receiving this because you’re a project owner on CrowdTest.
        </div>

      </div>

    </div>
    `;
}

function escapeHtml(title: string) {
    return title
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
