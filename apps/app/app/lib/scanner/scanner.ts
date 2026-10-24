import { crawlWebsite } from "./crawler";
import { deduplicateFindings } from "./findings/deduplicate";

export async function scanWebsite(url: string) {
  console.log(`🚀 Starting scan for ${url}`);

  const result = await crawlWebsite(url);

  const findings = deduplicateFindings(
    result.findings
  );

  console.log(
    `✅ Scan finished: ${result.pagesScanned} pages, ` +
    `${findings.length} unique findings`
  );

  return {
    ...result,
    findings,
  };
}