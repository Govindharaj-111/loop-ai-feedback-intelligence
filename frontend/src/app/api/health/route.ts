import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const backendUrl = getBackendUrl();
  if (!backendUrl) {
    return NextResponse.json(
      {
        status: "unconfigured",
        frontend: "online",
        backend: "unconfigured",
        error: "BACKEND_URL is not configured",
      },
      { status: 500 }
    );
  }

  try {
    const backendRes = await fetch(`${backendUrl}/api/health`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json({
        status: "ok",
        frontend: "online",
        backend: "online",
        backendUrl,
        backendDetails: data,
      });
    }

    return NextResponse.json(
      {
        status: "degraded",
        frontend: "online",
        backend: "unreachable",
        backendUrl,
        error: `Backend health returned status ${backendRes.status}`,
      },
      { status: 503 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "unavailable",
        frontend: "online",
        backend: "unreachable",
        backendUrl,
        error: err.message || "Failed to connect to backend API server",
      },
      { status: 503 }
    );
  }
}
