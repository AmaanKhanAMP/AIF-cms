/**
 * After a successful CMS mutation, ask the public site to drop stale ISR.
 * Never throws — save success must not depend on revalidation.
 */
export async function notifySiteRevalidate(resource) {
  if (!resource) return;
  try {
    const res = await fetch("/api/revalidate-site", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("[notifySiteRevalidate] proxy error", resource, res.status);
    }
  } catch (error) {
    console.error("[notifySiteRevalidate] failed", resource, error);
  }
}
