import { Finding } from "./finding";

export function deduplicateFindings(
  findings: Finding[]
): Finding[] {
  const unique = new Map<string, Finding>();

  for (const finding of findings) {
    const key = [
      finding.category,
      finding.url,
      finding.evidence.request ?? "",
      finding.evidence.statusCode ?? "",
      finding.evidence.error ?? "",
    ].join("|");

    if (!unique.has(key)) {
      unique.set(key, finding);
    }
  }

  return Array.from(unique.values());
}