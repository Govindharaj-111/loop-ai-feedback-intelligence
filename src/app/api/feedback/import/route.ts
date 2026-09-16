import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/security";
import { parseFeedbackCsv } from "@/lib/csvParser";

export async function POST(request: Request) {
  try {
    const session = await requireRole(["ADMIN", "ANALYST"]);
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No CSV file uploaded" }, { status: 400 });
    }

    const text = await file.text();
    const parseResult = parseFeedbackCsv(text);

    if (parseResult.validRows.length === 0) {
      return NextResponse.json(
        {
          error: "No valid feedback rows found in CSV",
          failedCount: parseResult.failedRows.length,
          failedRows: parseResult.failedRows,
        },
        { status: 400 }
      );
    }

    // MANDATORY workspaceId enforcement for all imported rows
    const dataToInsert = parseResult.validRows.map((row) => ({
      content: row.content,
      channel: row.channel,
      customerLabel: row.customerLabel || null,
      createdAt: row.createdAt || new Date(),
      sentiment: row.sentiment || "Neutral",
      status: row.status || "NEW",
      workspaceId: session.workspaceId,
    }));

    await prisma.feedback.createMany({
      data: dataToInsert,
    });

    return NextResponse.json({
      message: `Successfully imported ${parseResult.validRows.length} feedback items`,
      importedCount: parseResult.validRows.length,
      failedCount: parseResult.failedRows.length,
      failedRows: parseResult.failedRows,
    });
  } catch (error: any) {
    if (error.statusCode) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("CSV Import error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process CSV import file" },
      { status: 500 }
    );
  }
}
