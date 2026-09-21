import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

async function proxyRequest(req: NextRequest, pathParams: string[]) {
  const backendUrl = getBackendUrl();

  if (!backendUrl) {
    return NextResponse.json(
      { error: "BACKEND_URL is not configured" },
      { status: 500 }
    );
  }

  const subPath = pathParams && pathParams.length > 0 ? pathParams.join("/") : "";
  const targetUrl = `${backendUrl}/api/${subPath}${req.nextUrl.search}`;

  try {
    const headers = new Headers();
    
    // Forward essential request headers
    const reqCookie = req.headers.get("cookie");
    if (reqCookie) headers.set("cookie", reqCookie);

    const reqAuth = req.headers.get("authorization");
    if (reqAuth) headers.set("authorization", reqAuth);

    const reqContentType = req.headers.get("content-type");
    if (reqContentType) headers.set("content-type", reqContentType);

    headers.set("accept", "application/json");

    let body: any = null;
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      body = await req.text();
    }

    const backendRes = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: body || undefined,
      cache: "no-store",
    });

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

    // Pass through Set-Cookie headers from backend response
    const setCookies = backendRes.headers.getSetCookie
      ? backendRes.headers.getSetCookie()
      : [backendRes.headers.get("set-cookie")].filter(Boolean) as string[];

    for (const cookieStr of setCookies) {
      if (cookieStr) {
        response.headers.append("set-cookie", cookieStr);
      }
    }

    return response;
  } catch (err: any) {
    console.error(`[PROXY ERROR] Forwarding ${req.method} /api/${subPath} to ${targetUrl} failed:`, err);
    return NextResponse.json(
      {
        error: `Backend API server is unreachable at ${targetUrl}. Cause: ${err?.message || "Connection refused/timeout"}`,
      },
      { status: 503 }
    );
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return proxyRequest(req, params.path);
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return proxyRequest(req, params.path);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return proxyRequest(req, params.path);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return proxyRequest(req, params.path);
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return proxyRequest(req, params.path);
}
