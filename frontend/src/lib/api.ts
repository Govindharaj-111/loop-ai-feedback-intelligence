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

    const rawText = await res.text();
    let parsedData: any = null;
    let isJson = false;

    if (rawText && rawText.trim()) {
      try {
        parsedData = JSON.parse(rawText);
        isJson = true;
      } catch (jsonErr) {
        isJson = false;
      }
    }

    if (!res.ok) {
      let errorMessage = parsedData?.error || parsedData?.message;

      if (!errorMessage) {
        if (rawText.includes("<!DOCTYPE html>") || rawText.includes("<html") || rawText.includes("The page c") || !isJson) {
          errorMessage = `Server endpoint error (${res.status}). Please verify backend API server is running.`;
        } else {
          errorMessage = rawText.trim() || `Request failed with status ${res.status}`;
        }
      }

      return {
        ok: false,
        status: res.status,
        error: errorMessage,
        data: parsedData,
      };
    }

    if (!isJson && rawText.trim()) {
      return {
        ok: false,
        status: res.status,
        error: "Server returned a non-JSON response.",
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

