import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const backendUrl = getBackendUrl();
  if (!backendUrl) {
    return NextResponse.json(
      { error: "BACKEND_URL is not configured" },
      { status: 500 }
    );
  }

  const targetEndpoint = `${backendUrl}/api/auth/signup`;
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
      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
  }

  if (!backendRes) {
    return NextResponse.json(
      {
        error: `Backend API server is unreachable at ${targetEndpoint}. Cause: ${lastError?.message || "Connection refused/timeout"}`,
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
      data = { error: rawText.trim() || `Backend returned status ${backendRes.status}` };
    }
  }

  const response = NextResponse.json(data, { status: backendRes.status });

  const setCookies = backendRes.headers.getSetCookie
    ? backendRes.headers.getSetCookie()
    : [backendRes.headers.get("set-cookie")].filter(Boolean) as string[];

  for (const cookieStr of setCookies) {
    if (cookieStr) {
      response.headers.append("set-cookie", cookieStr);
    }
  }

  return response;
}
