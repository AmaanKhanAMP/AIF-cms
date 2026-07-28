const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function resolveImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) {
    return url;
  }
  const base = API_URL.replace(/\/$/, "");
  return url.startsWith("/") ? `${base}${url}` : `${base}/${url}`;
}

export function getApiBaseUrl() {
  return API_URL.replace(/\/$/, "");
}
