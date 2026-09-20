/**
 * Safe fetch utility for Project LOOP frontend.
 * Ensures responses are checked for HTTP status and Content-Type before parsing JSON.
 * Prevents "Unexpected token 'T', "The page c"... is not valid JSON" errors.
 */

export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Accept": "application/json",
        ...(options?.headers || {}),
      },
    });

    const contentType = res.headers.get("content-type") || "";
    let parsedData: any = null;
    let fallbackText = "";

    if (contentType.includes("application/json")) {
      try {
        parsedData = await res.json();
      } catch (jsonErr: any) {
        fallbackText = "Failed to parse server JSON response.";
      }
    } else {
      try {
        const rawText = await res.text();
        // If server returns HTML error page (e.g. Next.js 404/500 HTML), capture clean message
        if (rawText.includes("<!DOCTYPE html>") || rawText.includes("<html") || rawText.includes("The page could not be found")) {
          fallbackText = `Server endpoint non-JSON response (${res.status} ${res.statusText}). Please ensure backend API is running.`;
        } else {
          fallbackText = rawText.trim() || `Server returned status ${res.status}`;
        }
      } catch {
        fallbackText = `Server returned status ${res.status}`;
      }
    }

    if (!res.ok) {
      const errorMessage =
        parsedData?.error ||
        parsedData?.message ||
        fallbackText ||
        `Request failed with status code ${res.status}`;

      return {
        ok: false,
        status: res.status,
        error: errorMessage,
        data: parsedData,
      };
    }

    return {
      ok: true,
      status: res.status,
      data: parsedData as T,
    };
  } catch (err: any) {
    console.error(`Network error requesting ${url}:`, err);
    return {
      ok: false,
      status: 0,
      error: err.message || "Network error. Please check backend API server connection.",
    };
  }
}
