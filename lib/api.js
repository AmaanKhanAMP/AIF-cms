/**
 * Shared public API base URL for the AIF CMS (Next.js).
 *
 * Local:   NEXT_PUBLIC_API_URL=http://localhost:5000
 * Vercel:  NEXT_PUBLIC_API_URL=https://aif-backend-6jwe.onrender.com
 *
 * Never hardcode the production backend host in application code.
 */
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export function getApiBaseUrl() {
  return API_URL;
}
