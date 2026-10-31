import { transporter } from "./transporter";

interface ScanReportEmailProps {
  receiverEmail: string;
  projectId: string;
  projectName: string;
  projectUrl: string;
  pagesScanned: number;
  findings: {
    category: string;
    severity: string;
    confidence: string;
    url: string;
    description: string;
    request?: string;
    statusCode?: number;
    error?: string;
  }[];
}

export async function sendScanReport({
  receiverEmail,
  projectId,
  projectName,
  projectUrl,
  pagesScanned,
  findings,
}: ScanReportEmailProps) {
  const findingCount = findings.length;

  await transporter.sendMail({
    from: `"CrowdTest" <${process.env.EMAIL_SENDER}>`,
    to: receiverEmail,
    subject:
      findingCount === 0
        ? `[${projectName}] Automated QA Scan Passed`
        : `[${projectName}] Automated QA Scan — ${findingCount} Finding${
            findingCount === 1 ? "" : "s"
          }`,
    html: buildScanEmailHtml({
      projectId,
      projectName,
      projectUrl,
      pagesScanned,
      findings,
    }),
  });
}

function buildScanEmailHtml({
  projectId,
  projectName,
  projectUrl,
  pagesScanned,
  findings,
}: Omit<ScanReportEmailProps, "receiverEmail">) {
  const findingCount = findings.length;

  const findingsHtml =
    findings.length === 0
      ? `
        <tr>
          <td style="padding:20px;background:#f0fdf4;border-radius:6px;">
            <strong style="color:#166534;">
              No automated findings were detected.
            </strong>
            <p style="margin:8px 0 0;color:#166534;font-size:14px;">
              CrowdTest scanned ${pagesScanned} page${
                pagesScanned === 1 ? "" : "s"
              } on your website.
            </p>
          </td>
        </tr>
      `
      : findings
          .map((finding) => {
            const severityColor =
              finding.severity === "critical"
                ? "#dc2626"
                : finding.severity === "high"
                ? "#dc2626"
                : finding.severity === "medium"
                ? "#d97706"
                : "#16a34a";

            return `
              <tr>
                <td style="padding:20px 0;border-bottom:1px solid #e5e7eb;">
                  <div style="margin-bottom:8px;">
                    <span style="
                      background:${severityColor}15;
                      color:${severityColor};
                      padding:5px 10px;
                      border-radius:20px;
                      font-size:12px;
                      font-weight:600;
                    ">
                      ${escapeHtml(finding.severity)}
                    </span>

                    <span style="
                      margin-left:8px;
                      color:#6b7280;
                      font-size:12px;
                    ">
                      ${escapeHtml(finding.category)}
                    </span>
                  </div>

                  <p style="
                    margin:0 0 8px;
                    font-size:15px;
                    font-weight:600;
                    color:#111827;
                  ">
                    ${escapeHtml(finding.description)}
                  </p>

                  <p style="
                    margin:0 0 8px;
                    font-size:13px;
                    color:#6b7280;
                    word-break:break-all;
                  ">
                    Page: ${escapeHtml(finding.url)}
                  </p>

                  ${
                    finding.request
                      ? `
                        <p style="
                          margin:0 0 5px;
                          font-size:13px;
                          color:#6b7280;
                          word-break:break-all;
                        ">
                          Request: ${escapeHtml(finding.request)}
                        </p>
                      `
                      : ""
                  }

                  ${
                    finding.statusCode
                      ? `
                        <p style="
                          margin:0 0 5px;
                          font-size:13px;
                          color:#6b7280;
                        ">
                          HTTP Status: ${finding.statusCode}
                        </p>
                      `
                      : ""
                  }

                  ${
                    finding.error
                      ? `
                        <p style="
                          margin:10px 0 0;
                          padding:10px;
                          background:#f9fafb;
                          border-radius:5px;
                          font-size:12px;
                          color:#374151;
                          word-break:break-word;
                        ">
                          ${escapeHtml(finding.error)}
                        </p>
                      `
                      : ""
                  }
                </td>
              </tr>
            `;
          })
          .join("");

  return `
    <div style="margin:0;padding:0;background:#f4f6f8;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
          <td align="center">

            <table width="600" cellpadding="0" cellspacing="0"
              style="
                background:#ffffff;
                border-radius:8px;
                padding:40px;
                font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',
                Roboto,Helvetica,Arial,sans-serif;
                color:#111827;
              ">

              <tr>
                <td style="padding-bottom:30px;">
                  <h1 style="
                    margin:0;
                    font-size:22px;
                    font-weight:600;
                  ">
                    CrowdTest
                  </h1>

                  <p style="
                    margin:4px 0 0;
                    color:#6b7280;
                    font-size:14px;
                  ">
                    Automated QA Scan
                  </p>
                </td>
              </tr>

              <tr>
                <td style="
                  padding-bottom:20px;
                  font-size:15px;
                  line-height:1.6;
                ">
                  Your automated QA scan for
                  <strong>${escapeHtml(projectName)}</strong>
                  has completed.
                </td>
              </tr>

              <tr>
                <td style="padding-bottom:20px;">
                  <p style="
                    margin:0 0 6px;
                    font-size:14px;
                    color:#6b7280;
                  ">
                    Website
                  </p>

                  <p style="
                    margin:0;
                    font-size:14px;
                    word-break:break-all;
                  ">
                    ${escapeHtml(projectUrl)}
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding-bottom:25px;">
                  <p style="
                    margin:0;
                    font-size:14px;
                    color:#6b7280;
                  ">
                    Pages scanned:
                    <strong>${pagesScanned}</strong>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    Findings:
                    <strong>${findingCount}</strong>
                  </p>
                </td>
              </tr>

              <tr>
                <td>
                  <h2 style="
                    margin:0;
                    font-size:17px;
                    font-weight:600;
                  ">
                    Automated Findings
                  </h2>
                </td>
              </tr>

              ${findingsHtml}

              <tr>
                <td align="center" style="padding-top:35px;">
                  <a
                    href="${process.env.SITE_URL}/dashboard/${projectId}"
                    style="
                      background:#4f46e5;
                      color:#ffffff;
                      padding:12px 28px;
                      border-radius:6px;
                      text-decoration:none;
                      font-weight:600;
                      font-size:14px;
                      display:inline-block;
                    "
                  >
                    Review in CrowdTest
                  </a>
                </td>
              </tr>

              <tr>
                <td style="
                  padding-top:40px;
                  border-top:1px solid #e5e7eb;
                "></td>
              </tr>

              <tr>
                <td style="
                  padding-top:20px;
                  font-size:12px;
                  color:#9ca3af;
                  line-height:1.6;
                ">
                  This is an automated QA scan performed by CrowdTest.
                  Automated findings are not automatically classified as
                  confirmed bugs.
                  <br /><br />
                  © ${new Date().getFullYear()} CrowdTest.
                  All rights reserved.
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>
    </div>
  `;
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}