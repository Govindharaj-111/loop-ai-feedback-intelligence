/**
 * Helper utility to get the configured Backend API base URL.
 * Inspects all common environment variable names used across Vercel, Render, Netlify, AWS, etc.
 * Ensures trailing slashes are stripped to avoid double-slash route errors (e.g., //api/auth/signup).
 */
export function getBackendUrl(): string {
  const rawUrl =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "http://127.0.0.1:5000";

  // Remove trailing slash if present
  return rawUrl.trim().replace(/\/+$/, "");
}
