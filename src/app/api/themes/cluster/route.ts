import { NextResponse } from "next/server";
import { requireRole } from "@/lib/security";
import { clusterWorkspaceFeedback } from "@/lib/themeService";

export async function POST() {
  try {
    const session = await requireRole(["ADMIN", "ANALYST"]);
    const clusters = await clusterWorkspaceFeedback(session.workspaceId);

    return NextResponse.json({
      message: "AI Theme Clustering completed successfully",
      clustersCount: clusters.length,
      clusters,
    });
  } catch (error: any) {
    if (error.statusCode) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Theme clustering error:", error);
    return NextResponse.json({ error: "Failed to run AI theme clustering" }, { status: 500 });
  }
}
