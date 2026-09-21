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

  try {
    const backendUrl = getBackendUrl();
    const backendRes = await fetch(`${backendUrl}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        cookie: req.headers.get("cookie") || "",
      },
      body: JSON.stringify(body),
    });

    const rawText = await backendRes.text();
    let data: any = {};

    if (rawText && rawText.trim()) {
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { error: rawText.trim() || `Backend error (${backendRes.status})` };
      }
    }

    const response = NextResponse.json(data, { status: backendRes.status });

    // Forward Set-Cookie headers from backend if present
    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    return response;
  } catch (error: any) {
    console.error("Error in Next.js /api/auth/signup route:", error);
    return NextResponse.json(
      { error: "Backend API service is unavailable. Please verify backend server is running." },
      { status: 503 }
    );
  }
}
