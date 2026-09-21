import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl, isBackendUrlConfigured } from "@/lib/config";

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

  if (process.env.NODE_ENV === "production" && !isBackendUrlConfigured()) {
    console.error("[LOGIN ROUTE ERROR] Production BACKEND_URL environment variable is not configured on Vercel.");
    return NextResponse.json(
      {
        error: "Production Configuration Error: BACKEND_URL environment variable is missing in Vercel settings. Please add BACKEND_URL (e.g. https://your-backend.onrender.com) to Vercel Environment Variables and redeploy.",
      },
      { status: 503 }
    );
  }

  const backendUrl = getBackendUrl();
  const targetEndpoint = `${backendUrl}/api/auth/login`;

  let backendRes: Response | null = null;
  let lastError: any = null;

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
      break;
    } catch (err: any) {
      lastError = err;
      console.warn(`[LOGIN ROUTE] Attempt ${attempt} failed fetching ${targetEndpoint}: ${err.message}`);
      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
  }

  if (!backendRes) {
    console.error(`[LOGIN ROUTE ERROR] Target URL ${targetEndpoint} unreachable:`, lastError);
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

  const setCookie = backendRes.headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}
