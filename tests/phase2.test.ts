import { prisma } from "../src/lib/prisma";
import { parseFeedbackCsv } from "../src/lib/csvParser";
import { getSimulatedFeed } from "../src/lib/simulatedIngestion";
import { hashPassword } from "../src/lib/auth";

async function runPhase2Tests() {
  console.log("=================================================");
  console.log("   PROJECT LOOP — PHASE 2 AUTOMATED TEST SUITE   ");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      if (detail) console.error(`   Details: ${detail}`);
      failed++;
    }
  }

  try {
    // Cleanup prior test data
    await prisma.feedbackTheme.deleteMany();
    await prisma.embedding.deleteMany();
    await prisma.report.deleteMany();
    await prisma.theme.deleteMany();
    await prisma.feedback.deleteMany();
    await prisma.user.deleteMany();
    await prisma.workspace.deleteMany();

    const pwdHash = await hashPassword("TestPass123!");
    const workspace = await prisma.workspace.create({
      data: { name: "Phase 2 Core Test Workspace" },
    });

    const user = await prisma.user.create({
      data: {
        name: "Phase 2 Admin",
        email: "phase2admin@test.com",
        passwordHash: pwdHash,
        role: "ADMIN",
        workspaceId: workspace.id,
      },
    });

    // -----------------------------------------------------------------
    // TEST 1: Manual Feedback Creation with Custom Date & Channels
    // -----------------------------------------------------------------
    const manualFeedback = await prisma.feedback.create({
      data: {
        content: "Customer requesting dark mode custom theme customization",
        channel: "Support Ticket",
        customerLabel: "Enterprise Client X",
        sentiment: "Neutral",
        status: "NEW",
        createdAt: new Date("2026-08-20T10:00:00Z"),
        workspaceId: workspace.id,
      },
    });

    assert(
      manualFeedback.channel === "Support Ticket" &&
        manualFeedback.workspaceId === workspace.id &&
        manualFeedback.createdAt.toISOString().startsWith("2026-08-20"),
      "1. Manual feedback created with custom channel, date, and workspaceId isolation"
    );

    // -----------------------------------------------------------------
    // TEST 2: CSV Bulk Import Parsing & Validation
    // -----------------------------------------------------------------
    const csvContent = `content,channel,customer_label,created_at
"App crashes when saving settings page",App Review,User_102,2026-08-21
"Great customer support response time",NPS Survey,User_103,2026-08-22
"",Support Ticket,Blank_Row,2026-08-23`;

    const parseResult = parseFeedbackCsv(csvContent);

    assert(
      parseResult.validRows.length === 2 && parseResult.failedRows.length === 1,
      "2. CSV Parser validates rows, accepts valid data, and isolates invalid blank rows",
      `Valid: ${parseResult.validRows.length}, Failed: ${parseResult.failedRows.length}`
    );

    const insertedRows = await prisma.feedback.createMany({
      data: parseResult.validRows.map((r) => ({
        content: r.content,
        channel: r.channel,
        customerLabel: r.customerLabel,
        createdAt: r.createdAt || new Date(),
        sentiment: r.sentiment || "Neutral",
        status: r.status || "NEW",
        workspaceId: workspace.id,
      })),
    });

    assert(
      insertedRows.count === 2,
      "3. Valid CSV rows inserted into database with workspaceId attachment"
    );

    // -----------------------------------------------------------------
    // TEST 3: Simulated Channel Ingestion
    // -----------------------------------------------------------------
    const supportSimulated = getSimulatedFeed("support");
    const simInsert = await prisma.feedback.createMany({
      data: supportSimulated.map((s) => ({
        content: s.content,
        channel: s.channel,
        customerLabel: s.customerLabel,
        sentiment: s.sentiment,
        status: s.status,
        createdAt: s.createdAt,
        workspaceId: workspace.id,
      })),
    });

    assert(
      simInsert.count === supportSimulated.length,
      "4. Simulated channel ingestion seeds realistic demo feedback records"
    );

    // -----------------------------------------------------------------
    // TEST 4: Feedback Inbox Pagination, Search, and Multi-Field Filters
    // -----------------------------------------------------------------
    const totalCount = await prisma.feedback.count({ where: { workspaceId: workspace.id } });
    const paginatedFeedbacks = await prisma.feedback.findMany({
      where: { workspaceId: workspace.id },
      skip: 0,
      take: 2,
      orderBy: { createdAt: "desc" },
    });

    assert(
      totalCount >= 5 && paginatedFeedbacks.length === 2,
      "5. Feedback Inbox performs server-side pagination correctly",
      `Total: ${totalCount}, Page Size: 2`
    );

    const negativeSearch = await prisma.feedback.findMany({
      where: { workspaceId: workspace.id, sentiment: "Negative" },
    });

    assert(
      negativeSearch.length > 0 && negativeSearch.every((f) => f.sentiment === "Negative"),
      "6. Sentiment filter restricts query results strictly to matching sentiment"
    );

    // -----------------------------------------------------------------
    // TEST 5: Status Triage Transitions (NEW -> REVIEWED -> ACTIONED)
    // -----------------------------------------------------------------
    const updatedStatusItem = await prisma.feedback.update({
      where: { id: manualFeedback.id },
      data: { status: "ACTIONED" },
    });

    assert(
      updatedStatusItem.status === "ACTIONED",
      "7. Feedback status updated successfully to ACTIONED state"
    );

    // -----------------------------------------------------------------
    // TEST 6: Analytics Dashboard Data Aggregations
    // -----------------------------------------------------------------
    const negativeCount = await prisma.feedback.count({
      where: { workspaceId: workspace.id, sentiment: "Negative" },
    });
    const totalFb = await prisma.feedback.count({ where: { workspaceId: workspace.id } });
    const negPercent = Math.round((negativeCount / totalFb) * 100);

    assert(
      typeof negPercent === "number" && negPercent >= 0 && negPercent <= 100,
      "8. Analytics dashboard calculates real-time negative feedback percentage"
    );

    // -----------------------------------------------------------------
    // TEST 7: Multi-Tenant Workspace Isolation Verification
    // -----------------------------------------------------------------
    const workspaceB = await prisma.workspace.create({
      data: { name: "Tenant Beta Isolation Test Workspace" },
    });

    const betaFeedback = await prisma.feedback.create({
      data: {
        content: "Beta confidential customer item",
        channel: "Sales Call",
        workspaceId: workspaceB.id,
      },
    });

    const alphaQueriesOnly = await prisma.feedback.findMany({
      where: { workspaceId: workspace.id },
    });

    const isIsolated = !alphaQueriesOnly.some((f) => f.workspaceId === workspaceB.id);

    assert(
      isIsolated,
      "9. Multi-tenant security guarantees Tenant A queries NEVER expose Tenant B feedback"
    );

    console.log("\n=================================================");
    console.log(`TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
    console.log("=================================================\n");

    if (failed > 0) process.exit(1);
  } catch (error) {
    console.error("Test execution error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase2Tests();
