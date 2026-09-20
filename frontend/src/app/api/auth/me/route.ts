import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

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

    const contentType = backendRes.headers.get("content-type") || "";
    let data: any = {};

    if (contentType.includes("application/json")) {
      data = await backendRes.json();
    } else {
      data = { error: "Unauthorized" };
    }

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    return NextResponse.json({ error: "Backend API unavailable" }, { status: 503 });
  }
}
