export function normalizeUrl(
  url: string,
  startUrl: URL
): string | null {
  try {
    const parsed = new URL(url);

    // Only scan the same website.
    if (parsed.origin !== startUrl.origin) {
      return null;
    }

    // /about#team === /about
    parsed.hash = "";

    // Remove trailing slash except for the homepage.
    if (parsed.pathname !== "/") {
      parsed.pathname = parsed.pathname.replace(/\/$/, "");
    }

    const ignoredExtensions = [
      ".pdf",
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".svg",
      ".webp",
      ".mp4",
      ".mp3",
      ".zip",
      ".css",
      ".js",
    ];

    const pathname = parsed.pathname.toLowerCase();

    if (
      ignoredExtensions.some((extension) =>
        pathname.endsWith(extension)
      )
    ) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}