

export async function triggerScan(projectId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!baseUrl) {
    throw new Error("SITE_URL is not configured.");
  }

  const response = await fetch(`${baseUrl}/api/scans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      projectId,
    }),
  });

  if (!response.ok) {
    const body = await response.text();

    throw new Error(
      `Scan trigger failed: ${response.status} ${body}`
    );
  }

  return response.json();
}