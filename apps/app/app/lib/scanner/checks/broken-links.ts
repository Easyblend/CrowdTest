import { request } from "playwright";
import { Finding } from "../findings/finding";
import {
  classifyBrokenLink,
} from "../findings/classifier";

export async function collectBrokenLinks(
  links: string[],
  startUrl: string,
  checkedLinks: Set<string>
): Promise<Finding[]> {
  const findings: Finding[] = [];

  const startOrigin =
    new URL(startUrl).origin;

  const context = await request.newContext();

  try {
    for (const link of links) {
      let parsed: URL;

      try {
        parsed = new URL(link);
      } catch {
        continue;
      }

      // Only check internal links.
      if (parsed.origin !== startOrigin) {
        continue;
      }

      // Avoid checking the same URL multiple times
      // during the same scan.
      if (checkedLinks.has(link)) {
        continue;
      }

      checkedLinks.add(link);

      try {
        const response = await context.get(link, {
          timeout: 10_000,
          failOnStatusCode: false,
        });

        const status = response.status();

        const classification =
          classifyBrokenLink(status);

        if (!classification) {
          continue;
        }

        findings.push({
          ...classification,
          url: startUrl,
          description:
            `Internal link returned HTTP ${status}.`,
          evidence: {
            request: link,
            statusCode: status,
          },
        });
      } catch (error) {
        findings.push({
          category: "broken_link",
          severity: "high",
          confidence: "high",
          url: startUrl,
          description:
            "Internal link could not be reached.",
          evidence: {
            request: link,
            error:
              error instanceof Error
                ? error.message
                : "Unknown error",
          },
        });
      }
    }
  } finally {
    await context.dispose();
  }

  return findings;
}