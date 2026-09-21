/**
 * Helper utility to resolve the configured Backend API base URL.
 * Only uses localhost:5000 as a fallback during local development (NODE_ENV === "development").
 * In production, requires process.env.BACKEND_URL or NEXT_PUBLIC_BACKEND_URL to be set.
 */
export function getBackendUrl(): string | null {
  const rawUrl =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL;

  if (rawUrl && rawUrl.trim()) {
    return rawUrl.trim().replace(/\/+$/, "");
  }

  if (process.env.NODE_ENV === "development") {
    return "http://127.0.0.1:5000";
  }

  return null;
}

export function isBackendUrlConfigured(): boolean {
  return getBackendUrl() !== null;
}
