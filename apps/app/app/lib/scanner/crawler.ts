import { chromium, Browser, Page } from "playwright";

import { normalizeUrl } from "./url-normalizer";
import { collectJavaScriptErrors } from "./checks/javascript";
import { collectNetworkErrors } from "./checks/network";
import { collectBrokenLinks } from "./checks/broken-links";
import { Finding } from "./findings/finding";

const MAX_PAGES = 10;

export interface CrawlResult {
  pagesScanned: number;
  findings: Finding[];
}

export async function crawlWebsite(
  startUrlString: string
): Promise<CrawlResult> {
  const startUrl = new URL(startUrlString);

  const visited = new Set<string>();
  const queue: string[] = [startUrl.toString()];
  const checkedLinks = new Set<string>();

  const findings: Finding[] = [];

  const browser: Browser = await chromium.launch({
    headless: true,
  });

  try {
    while (
      queue.length > 0 &&
      visited.size < MAX_PAGES
    ) {
      const url = queue.shift();

      if (!url || visited.has(url)) {
        continue;
      }

      visited.add(url);

      console.log(`🔎 Scanning ${url}`);

      const page: Page = await browser.newPage();

      try {
        // --------------------------------
        // 1. JavaScript error collection
        // --------------------------------

        const pageFindings = collectJavaScriptErrors(
          page,
          url
        );

        // --------------------------------
        // 2. Network error collection
        // --------------------------------

        const networkFindings = collectNetworkErrors(
          page,
          url
        );

        // --------------------------------
        // 3. Visit the page
        // --------------------------------

        await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 30_000,
        });

        // Give client-side JavaScript a short
        // amount of time to execute.
        await page.waitForTimeout(500);

        // Add findings collected by event listeners.
        findings.push(...pageFindings);
        findings.push(...networkFindings);

        // --------------------------------
        // 4. Extract links
        // --------------------------------

        const links = await page
          .locator("a[href]")
          .evaluateAll((anchors) =>
            anchors
              .map(
                (anchor) =>
                  (anchor as HTMLAnchorElement).href
              )
              .filter(Boolean)
          );

        // --------------------------------
        // 5. Check internal links
        // --------------------------------

        const linkFindings =
          await collectBrokenLinks(
            links,
            url,
            checkedLinks
          );

        findings.push(...linkFindings);

        // --------------------------------
        // 6. Add new pages to crawl queue
        // --------------------------------

        for (const link of links) {
          const normalized = normalizeUrl(
            link,
            startUrl
          );

          if (
            normalized &&
            !visited.has(normalized) &&
            !queue.includes(normalized)
          ) {
            queue.push(normalized);
          }
        }

        console.log(
          `   ✓ ${url} scanned`
        );
      } catch (error) {
        console.error(
          `   ⚠️ Failed: ${url}`
        );

        if (error instanceof Error) {
          console.error(
            `      ${error.message}`
          );
        }
      } finally {
        await page.close();
      }
    }

    return {
      pagesScanned: visited.size,
      findings,
    };
  } finally {
    await browser.close();
  }
}