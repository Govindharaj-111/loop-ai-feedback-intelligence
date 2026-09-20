import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000";

export async function GET(req: NextRequest) {
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        cookie: req.headers.get("cookie") || "",
        authorization: req.headers.get("authorization") || "",
      },
    });

    const rawText = await backendRes.text();
    let data: any = {};

    if (rawText && rawText.trim()) {
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { error: "Unauthorized" };
      }
    }

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    return NextResponse.json({ error: "Backend API unavailable" }, { status: 503 });
  }
}
