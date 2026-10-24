import { Page, Request, Response } from "@playwright/test";
import { Finding } from "../findings/finding";
import {
  classifyResponse,
  ResourceType,
} from "../findings/classifier";

export function collectNetworkErrors(
  page: Page,
  startUrl: string
): Finding[] {
  const findings: Finding[] = [];

  const startOrigin = new URL(startUrl).origin;

  page.on("response", (response: Response) => {
    const status = response.status();

    if (status < 400) {
      return;
    }

    try {
      const responseUrl = response.url();

      const responseOrigin =
        new URL(responseUrl).origin;

      // Ignore third-party failures for V1.
      if (responseOrigin !== startOrigin) {
        return;
      }

      const resourceType =
        response.request().resourceType() as ResourceType;

      const isTargetPage =
        resourceType === "document" &&
        responseUrl === startUrl;

      const classification =
        classifyResponse({
          status,
          resourceType,
          isTargetPage,
        });

      findings.push({
        ...classification,
        url: startUrl,
        description: isTargetPage
          ? `Target page returned HTTP ${status}.`
          : `${resourceType} resource returned HTTP ${status}.`,
        evidence: {
          request: responseUrl,
          statusCode: status,
        },
      });
    } catch {
      // Ignore malformed URLs.
    }
  });

  page.on("requestfailed", (request: Request) => {
    const errorText =
      request.failure()?.errorText;

    // Browser cancellations are ignored for V1.
    if (errorText === "net::ERR_ABORTED") {
      return;
    }

    try {
      const requestUrl = request.url();

      const requestOrigin =
        new URL(requestUrl).origin;

      // Ignore third-party failures for V1.
      if (requestOrigin !== startOrigin) {
        return;
      }

      findings.push({
        category: "network",
        severity: "high",
        confidence: "high",
        url: startUrl,
        description:
          "Same-origin network request failed.",
        evidence: {
          request: requestUrl,
          error: errorText,
        },
      });
    } catch {
      // Ignore malformed URLs.
    }
  });

  return findings;
}