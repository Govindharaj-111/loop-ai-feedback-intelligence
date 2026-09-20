import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function POST(req: NextRequest) {
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        cookie: req.headers.get("cookie") || "",
      },
    });

    const contentType = backendRes.headers.get("content-type") || "";
    let data: any = {};

    if (contentType.includes("application/json")) {
      data = await backendRes.json();
    } else {
      data = { message: "Logout processed" };
    }

    const response = NextResponse.json(data, { status: backendRes.status });

    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    return response;
  } catch (error: any) {
    return NextResponse.json({ message: "Logout processed" }, { status: 200 });
  }
}
