import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/config";

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload format" },
      { status: 400 }
    );
  }

  const backendUrl = getBackendUrl();
  const targetEndpoint = `${backendUrl}/api/auth/signup`;

  let backendRes: Response | null = null;
  let lastError: any = null;

  // Try up to 2 times to absorb cold-start delays on sleeping backend instances
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      backendRes = await fetch(targetEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          cookie: req.headers.get("cookie") || "",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      });
      break; // Request succeeded, break loop
    } catch (err: any) {
      lastError = err;
      console.warn(`[SIGNUP ROUTE] Attempt ${attempt} failed fetching ${targetEndpoint}: ${err.message}`);
      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Wait 1.5s for backend warmup
      }
    }
  }

  if (!backendRes) {
    console.error(`[SIGNUP ROUTE ERROR] Target URL ${targetEndpoint} unreachable:`, lastError);
    return NextResponse.json(
      {
        error: `Backend API service at ${backendUrl} is unavailable or starting up. Please verify backend server is running.`,
      },
      { status: 503 }
    );
  }

  const rawText = await backendRes.text();
  let data: any = {};

  if (rawText && rawText.trim()) {
    try {
      data = JSON.parse(rawText);
    } catch {
      data = { error: rawText.trim() || `Backend API error (${backendRes.status})` };
    }
  }

  const response = NextResponse.json(data, { status: backendRes.status });

  // Forward Set-Cookie headers from backend if present
  const setCookie = backendRes.headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}
