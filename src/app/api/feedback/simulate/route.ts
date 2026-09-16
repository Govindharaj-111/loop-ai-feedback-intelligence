import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/security";
import { getSimulatedFeed } from "@/lib/simulatedIngestion";

export async function POST(request: Request) {
  try {
    const session = await requireRole(["ADMIN", "ANALYST"]);
    const body = await request.json();
    const { channelType } = body;

    const simulatedItems = getSimulatedFeed(channelType || "all");

    // MANDATORY workspaceId enforcement
    const dataToInsert = simulatedItems.map((item) => ({
      content: item.content,
      channel: item.channel,
      customerLabel: item.customerLabel,
      sentiment: item.sentiment,
      status: item.status,
      createdAt: item.createdAt,
      workspaceId: session.workspaceId,
    }));

    await prisma.feedback.createMany({
      data: dataToInsert,
    });

    return NextResponse.json({
      message: `Simulated channel feed imported successfully`,
      importedCount: dataToInsert.length,
    });
  } catch (error: any) {
    if (error.statusCode) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Simulated ingestion error:", error);
    return NextResponse.json({ error: "Failed to simulate channel ingestion" }, { status: 500 });
  }
}
