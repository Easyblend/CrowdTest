import { transporter } from "./transporter";

interface BugReportEmailProps {
  receiverEmail: string;
  projectId: number;
  projectName: string;
  receiverName: string;
  bugTitle: string;
  bugDescription: string;
  severity: string;
  screenshotUrl?: string;
}

export async function sendBugReport({
  receiverEmail,
  projectName,
  projectId,
  receiverName,
  bugTitle,
  bugDescription,
  severity,
  screenshotUrl,
}: BugReportEmailProps) {
  await transporter.sendMail({
    from: `"CrowdTest" <hello@crowdtest.dev>`,
    to: receiverEmail,
    subject: `New ${severity} bug reported in ${projectName}`,
    html: buildBugEmailHtml({
      projectName,
      projectId,
      receiverName,
      bugTitle,
      bugDescription,
      severity,
      screenshotUrl,
    }),
  });
}

function buildBugEmailHtml({
  projectName,
  projectId,
  receiverName,
  bugTitle,
  bugDescription,
  severity,
  screenshotUrl,
}: Omit<BugReportEmailProps, "receiverEmail">) {
  const safeTitle = escapeHtml(bugTitle);
  const safeDescription = escapeHtml(bugDescription);

  const severityColor =
    severity === "HIGH"
      ? "#dc2626"
      : severity === "MEDIUM"
      ? "#d97706"
      : "#16a34a";

  return `
  <div style="margin:0;padding:0;background:#f4f6f8;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">

          <!-- Email Container -->
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;padding:40px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111827;">
            
            <!-- Header -->
            <tr>
              <td style="padding-bottom:30px;">
                <h1 style="margin:0;font-size:22px;font-weight:600;">
                  CrowdTest
                </h1>
                <p style="margin:4px 0 0 0;color:#6b7280;font-size:14px;">
                  Bug Monitoring & Feedback Platform
                </p>
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td style="padding-bottom:20px;font-size:15px;">
                Hello ${receiverName},
              </td>
            </tr>

            <!-- Main Message -->
            <tr>
              <td style="padding-bottom:20px;font-size:15px;line-height:1.6;">
                A new issue has been reported in your project 
                <strong>${projectName}</strong>.
              </td>
            </tr>

            <!-- Severity Badge -->
            <tr>
              <td style="padding-bottom:20px;">
                <span style="
                  background:${severityColor}15;
                  color:${severityColor};
                  padding:6px 12px;
                  font-size:13px;
                  border-radius:20px;
                  font-weight:600;
                  display:inline-block;
                ">
                  ${severity} Severity
                </span>
              </td>
            </tr>

            <!-- Bug Details -->
            <tr>
              <td style="padding-bottom:10px;font-size:14px;color:#6b7280;">
                Issue Title
              </td>
            </tr>
            <tr>
              <td style="padding-bottom:20px;font-size:16px;font-weight:600;">
                ${safeTitle}
              </td>
            </tr>

            <tr>
              <td style="padding-bottom:10px;font-size:14px;color:#6b7280;">
                Description
              </td>
            </tr>
            <tr>
              <td style="padding:16px;background:#f9fafb;border-radius:6px;font-size:14px;line-height:1.6;">
                ${safeDescription}
              </td>
            </tr>

            ${
              screenshotUrl
                ? `
                <tr>
                  <td style="padding-top:25px;">
                    <p style="margin:0 0 10px 0;font-size:14px;color:#6b7280;">
                      Attached Screenshot
                    </p>
                    <img src="${screenshotUrl}" style="max-width:100%;border-radius:6px;border:1px solid #e5e7eb;" />
                  </td>
                </tr>
              `
                : ""
            }

            <!-- CTA -->
            <tr>
              <td align="center" style="padding-top:35px;">
                <a href="${process.env.SITE_URL}/dashboard/${projectId}"
                  style="
                    background:#4f46e5;
                    color:#ffffff;
                    padding:12px 28px;
                    border-radius:6px;
                    text-decoration:none;
                    font-weight:600;
                    font-size:14px;
                    display:inline-block;
                  ">
                  View in Dashboard
                </a>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding-top:40px;border-top:1px solid #e5e7eb;"></td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding-top:20px;font-size:12px;color:#9ca3af;line-height:1.6;">
                This notification was sent by CrowdTest because you are the owner of the project <strong>${projectName}</strong>.
                <br /><br />
                © ${new Date().getFullYear()} CrowdTest. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </div>
  `;
}


function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
