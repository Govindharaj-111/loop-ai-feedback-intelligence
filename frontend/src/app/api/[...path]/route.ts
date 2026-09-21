import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/config";

async function proxyRequest(req: NextRequest, params: { path: string[] }) {
  const backendUrl = getBackendUrl();
  const subPath = params.path ? params.path.join("/") : "";
  const targetUrl = `${backendUrl}/api/${subPath}${req.nextUrl.search}`;

  try {
    const headers: Record<string, string> = {
      "Accept": "application/json",
      "cookie": req.headers.get("cookie") || "",
      "authorization": req.headers.get("authorization") || "",
    };

    const contentType = req.headers.get("content-type");
    if (contentType) {
      headers["content-type"] = contentType;
    }

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
        data = { error: rawText.trim() || `Backend API error (${backendRes.status})` };
      }
    }

    const response = NextResponse.json(data, { status: backendRes.status });

    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    return response;
  } catch (err: any) {
    console.error(`[PROXY ERROR] Failed to proxy ${req.method} /api/${subPath} -> ${targetUrl}:`, err);
    return NextResponse.json(
      {
        error: `Backend API service is unavailable. Could not connect to target URL: ${targetUrl}`,
      },
      { status: 503 }
    );
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return proxyRequest(req, params);
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return proxyRequest(req, params);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return proxyRequest(req, params);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return proxyRequest(req, params);
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return proxyRequest(req, params);
}
