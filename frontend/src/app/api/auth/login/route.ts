import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const backendRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        cookie: req.headers.get("cookie") || "",
      },
      body: JSON.stringify(body),
    });

    const contentType = backendRes.headers.get("content-type") || "";
    let data: any = {};

    if (contentType.includes("application/json")) {
      data = await backendRes.json();
    } else {
      const text = await backendRes.text();
      data = { error: text || `Backend API error (${backendRes.status})` };
    }

    const response = NextResponse.json(data, { status: backendRes.status });

    // Forward Set-Cookie headers from backend if present
    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    return response;
  } catch (error: any) {
    console.error("Error in Next.js /api/auth/login route:", error);
    return NextResponse.json(
      { error: "Backend API service is unavailable. Please verify backend server is running." },
      { status: 503 }
    );
  }
}
