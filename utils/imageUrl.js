import { API_URL, getApiBaseUrl } from "@/lib/api";

export { API_URL, getApiBaseUrl } from "@/lib/api";

/**
 * Resolve media URLs for CMS previews.
 * Rewrites absolute localhost:5000 URLs to the current API_URL so
 * production never requests the developer's machine.
 */
export function resolveImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("blob:") || url.startsWith("data:")) return url;

  const rewritten = String(url).replace(
    /^https?:\/\/(localhost|127\.0\.0\.1):5000/i,
    API_URL
  );

  if (
    rewritten.startsWith("http://") ||
    rewritten.startsWith("https://") ||
    rewritten.startsWith("blob:")
  ) {
    return rewritten;
  }

  // Frontend public assets (e.g. /assets/logo.png) live on the website host, not the API.
  if (rewritten.startsWith("/assets/")) {
    const site = (
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    ).replace(/\/$/, "");
    return `${site}${rewritten}`;
  }

  const base = getApiBaseUrl();
  return rewritten.startsWith("/") ? `${base}${rewritten}` : `${base}/${rewritten}`;
}
