import { Page } from "playwright";
import { Finding } from "../findings/finding";
import {
  classifyJavaScriptError,
} from "../findings/classifier";

export function collectJavaScriptErrors(
  page: Page,
  url: string
): Finding[] {
  const findings: Finding[] = [];

  page.on("pageerror", (error) => {
    const classification =
      classifyJavaScriptError();

    findings.push({
      ...classification,
      url,
      description:
        "Unhandled JavaScript error detected on the page.",
      evidence: {
        error: error.message,
        stack: error.stack,
      },
    });
  });

  return findings;
}