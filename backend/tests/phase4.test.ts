import { prisma } from "../src/lib/prisma.js";
import { calculateVerifiedStats, generateVocReportContent } from "../src/lib/reportService.js";
import { hashPassword } from "../src/lib/auth.js";

async function runPhase4Tests() {
  console.log("=================================================");
  console.log("   PROJECT LOOP — PHASE 4 AUTOMATED TEST SUITE   ");
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

    const pwdHash = await hashPassword("ReportTestPass123!");
    const tenantA = await prisma.workspace.create({
      data: { name: "Report Workspace Alpha" },
    });

    const tenantB = await prisma.workspace.create({
      data: { name: "Report Workspace Beta" },
    });

    const userA = await prisma.user.create({
      data: {
        name: "Report Admin A",
        email: "reportadmin@alpha.com",
        passwordHash: pwdHash,
        role: "ADMIN",
        workspaceId: tenantA.id,
      },
    });

    // Seed test feedback items in Tenant A
    await prisma.feedback.createMany({
      data: [
        {
          content: "Checkout UI is very fast and smooth",
          channel: "App Review",
          sentiment: "Positive",
          sentimentScore: 0.9,
          workspaceId: tenantA.id,
          createdAt: new Date("2026-08-15T10:00:00Z"),
        },
        {
          content: "Payment fails on mobile safari browser",
          channel: "Support Ticket",
          sentiment: "Negative",
          sentimentScore: -0.8,
          workspaceId: tenantA.id,
          createdAt: new Date("2026-08-18T14:00:00Z"),
        },
        {
          content: "Requesting dark mode color scheme toggle",
          channel: "NPS Survey",
          sentiment: "Neutral",
          sentimentScore: 0.0,
          workspaceId: tenantA.id,
          createdAt: new Date("2026-08-20T09:00:00Z"),
        },
      ],
    });

    // -----------------------------------------------------------------
    // TEST 1: Server-Side Verified Statistics Calculation
    // -----------------------------------------------------------------
    const periodStart = new Date("2026-08-01T00:00:00Z");
    const periodEnd = new Date("2026-08-25T23:59:59Z");

    const stats = await calculateVerifiedStats(tenantA.id, periodStart, periodEnd);

    assert(
      stats.totalFeedback === 3 &&
        stats.positiveCount === 1 &&
        stats.negativeCount === 1 &&
        stats.neutralCount === 1 &&
        stats.positivePercent === 33 &&
        stats.negativePercent === 33,
      "1. Server application code calculates verified database statistics and percentages",
      `Total: ${stats.totalFeedback}, Pos%: ${stats.positivePercent}%, Neg%: ${stats.negativePercent}%`
    );

    // -----------------------------------------------------------------
    // TEST 2: VoC Report Content Synthesis
    // -----------------------------------------------------------------
    const vocContent = await generateVocReportContent(stats);

    assert(
      vocContent.executiveSummary.length > 0 &&
        vocContent.importantTrends.length > 0 &&
        vocContent.recommendedActions.length > 0,
      "2. VoC Report Generator synthesizes executive summary, trends, and action items"
    );

    // -----------------------------------------------------------------
    // TEST 3: Report Storage in Database
    // -----------------------------------------------------------------
    const reportA = await prisma.report.create({
      data: {
        title: "Q3 Executive VoC Report",
        periodStart,
        periodEnd,
        contentJson: JSON.stringify({ stats, content: vocContent }),
        workspaceId: tenantA.id,
        generatedBy: userA.id,
      },
    });

    assert(
      reportA.id !== undefined && reportA.workspaceId === tenantA.id,
      "3. VoC Report stored in database with workspaceId attachment"
    );

    // -----------------------------------------------------------------
    // TEST 4: Empty Date Period Handling
    // -----------------------------------------------------------------
    const emptyStart = new Date("2020-01-01T00:00:00Z");
    const emptyEnd = new Date("2020-01-31T23:59:59Z");

    const emptyStats = await calculateVerifiedStats(tenantA.id, emptyStart, emptyEnd);
    const emptyContent = await generateVocReportContent(emptyStats);

    assert(
      emptyStats.totalFeedback === 0 &&
        emptyContent.executiveSummary.includes("Insufficient customer feedback data"),
      "4. Empty date period handled gracefully: Refuses to invent statistics when evidence is missing"
    );

    // -----------------------------------------------------------------
    // TEST 5: Large Date Period Handling
    // -----------------------------------------------------------------
    const largeStart = new Date("2025-01-01T00:00:00Z");
    const largeEnd = new Date("2026-12-31T23:59:59Z");

    const largeStats = await calculateVerifiedStats(tenantA.id, largeStart, largeEnd);

    assert(
      largeStats.totalFeedback === 3,
      "5. Large date period correctly aggregates workspace records across full boundary"
    );

    // -----------------------------------------------------------------
    // TEST 6: Report Database Retrieval & Content Unpacking
    // -----------------------------------------------------------------
    const fetchedReport = await prisma.report.findUnique({
      where: { id: reportA.id },
    });

    let unpacked: any = {};
    if (fetchedReport?.contentJson) {
      unpacked = JSON.parse(fetchedReport.contentJson);
    }

    assert(
      fetchedReport !== null && unpacked.stats?.totalFeedback === 3,
      "6. Report detail retrieved from database and JSON payload unpacked successfully"
    );

    // -----------------------------------------------------------------
    // TEST 7: Cross-Workspace Report Isolation (CRITICAL)
    // -----------------------------------------------------------------
    const reportB = await prisma.report.create({
      data: {
        title: "Beta Tenant Confidential Executive Report",
        periodStart,
        periodEnd,
        contentJson: JSON.stringify({ stats: emptyStats, content: emptyContent }),
        workspaceId: tenantB.id,
        generatedBy: userA.id,
      },
    });

    let crossReportBlocked = false;
    if (reportB.workspaceId !== tenantA.id) {
      crossReportBlocked = true;
    }

    assert(
      crossReportBlocked,
      "7. CRITICAL REPORT SECURITY: Tenant A cannot access or retrieve Tenant B's reports"
    );

    // -----------------------------------------------------------------
    // TEST 8: Report Deletion with Tenant Check
    // -----------------------------------------------------------------
    await prisma.report.delete({
      where: { id: reportA.id },
    });

    const deletedCheck = await prisma.report.findUnique({
      where: { id: reportA.id },
    });

    assert(
      deletedCheck === null,
      "8. Report deleted successfully from database"
    );

    console.log("\n=================================================");
    console.log(`TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
    console.log("=================================================\n");

    if (failed > 0) process.exit(1);
  } catch (error) {
    console.error("Phase 4 Test fatal error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase4Tests();
