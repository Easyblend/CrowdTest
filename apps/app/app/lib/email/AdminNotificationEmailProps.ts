import { transporter } from "./transporter";

interface AdminNotificationEmailProps {
  subject: string;
  message: string;
  link?: string;
}

export async function sendAdminNotification({
  subject,
  message,
  link,
}: AdminNotificationEmailProps) {
  await transporter.sendMail({
    from: `"CrowdTest" <hello@crowdtest.dev>`,
    to: process.env.ADMIN_EMAIL, // Set your admin email in env
    subject: `[ADMIN] ${subject}`,
    html: buildAdminEmailHtml({ subject, message, link }),
  });
}

function buildAdminEmailHtml({ subject, message, link }: AdminNotificationEmailProps) {
  return `
    <div style="margin:0;padding:0;background:#f4f6f8;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;padding:40px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111827;">
              
              <tr>
                <td style="padding-bottom:20px;">
                  <h1 style="margin:0;font-size:22px;font-weight:600;">CrowdTest Admin Notification</h1>
                </td>
              </tr>

              <tr>
                <td style="padding-bottom:20px;font-size:15px;line-height:1.6;">
                  <strong>${subject}</strong>
                </td>
              </tr>

              <tr>
                <td style="padding-bottom:20px;font-size:14px;line-height:1.6;color:#6b7280;">
                  ${message}
                </td>
              </tr>

              ${
                link
                  ? `<tr>
                       <td align="center" style="padding-top:20px;">
                         <a href="${link}" style="background:#4f46e5;color:#ffffff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;display:inline-block;">
                           View
                         </a>
                       </td>
                     </tr>`
                  : ""
              }

              <tr>
                <td style="padding-top:40px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;line-height:1.6;">
                  This is an automated notification from CrowdTest Admin.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
}
