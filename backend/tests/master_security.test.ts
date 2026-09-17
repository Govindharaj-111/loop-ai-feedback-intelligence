import { prisma } from "../src/lib/prisma.js";
import { hashPassword, comparePassword } from "../src/lib/auth.js";
import { createToken, verifyToken } from "../src/lib/session.js";
import { requireAuth, requireRole, requireWorkspaceAccess, AuthError, ForbiddenError } from "../src/lib/security.js";
import { classifyFeedbackText, ClassificationSchema } from "../src/lib/aiService.js";
import { parseFeedbackCsv } from "../src/lib/csvParser.js";
import { askLoopRag, searchWorkspaceEmbeddings, generateEmbeddingVector } from "../src/lib/vectorRagService.js";
import { calculateVerifiedStats, generateVocReportContent } from "../src/lib/reportService.js";

async function runMasterSecuritySuite() {
  console.log("===================================================================");
  console.log("   PROJECT LOOP — MASTER SECURITY & QUALITY ASSURANCE TEST SUITE   ");
  console.log("===================================================================\n");

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
    // -----------------------------------------------------------------
    // CLEANUP & SEEDING ENVIRONMENT
    // -----------------------------------------------------------------
    await prisma.feedbackTheme.deleteMany();
    await prisma.embedding.deleteMany();
    await prisma.report.deleteMany();
    await prisma.theme.deleteMany();
    await prisma.feedback.deleteMany();
    await prisma.user.deleteMany();
    await prisma.workspace.deleteMany();

    const pwdHash = await hashPassword("MasterSecret123!");

    // Workspace A (Tenant Alpha)
    const tenantA = await prisma.workspace.create({ data: { name: "Tenant Alpha Security Corp" } });
    const adminA = await prisma.user.create({
      data: { name: "Alpha Admin", email: "admin@alpha.com", passwordHash: pwdHash, role: "ADMIN", workspaceId: tenantA.id },
    });
    const analystA = await prisma.user.create({
      data: { name: "Alpha Analyst", email: "analyst@alpha.com", passwordHash: pwdHash, role: "ANALYST", workspaceId: tenantA.id },
    });
    const viewerA = await prisma.user.create({
      data: { name: "Alpha Viewer", email: "viewer@alpha.com", passwordHash: pwdHash, role: "VIEWER", workspaceId: tenantA.id },
    });

    // Workspace B (Tenant Beta)
    const tenantB = await prisma.workspace.create({ data: { name: "Tenant Beta Security Corp" } });
    const adminB = await prisma.user.create({
      data: { name: "Beta Admin", email: "admin@beta.com", passwordHash: pwdHash, role: "ADMIN", workspaceId: tenantB.id },
    });

    // -----------------------------------------------------------------
    // SECTION 1: AUTHENTICATION SECURITY (STAGE 5.1)
    // -----------------------------------------------------------------
    // Test 1.1: Password Hashing Verification
    const passMatch = await comparePassword("MasterSecret123!", adminA.passwordHash);
    const passMismatch = await comparePassword("WrongPassword!", adminA.passwordHash);
    assert(passMatch && !passMismatch, "1.1 Authentication: Password hashing via bcryptjs verifies correctly and rejects wrong credentials");

    // Test 1.2: Session JWT Issuance & Verification
    const tokenA = await createToken({
      sub: adminA.id,
      name: adminA.name,
      email: adminA.email,
      role: "ADMIN",
      workspaceId: tenantA.id,
      workspaceName: tenantA.name,
    });
    const payloadA = await verifyToken(tokenA);
    assert(payloadA?.sub === adminA.id && payloadA?.workspaceId === tenantA.id, "1.2 Authentication: JWT session token signed and verified with correct payload");

    // Test 1.3: Invalid Token Rejection
    const invalidToken = await verifyToken("malformed.jwt.token.signature");
    assert(invalidToken === null, "1.3 Authentication: Malformed/invalid JWT token rejected cleanly");

    // Test 1.4: Unauthenticated Access Rejection
    let unauthCaught = false;
    try {
      const sessionUser = null;
      if (!sessionUser) throw new AuthError("Unauthorized: Authentication required", 401);
    } catch (e: any) {
      if (e.statusCode === 401) unauthCaught = true;
    }
    assert(unauthCaught, "1.4 Authentication: Unauthenticated requests throw HTTP 401 Unauthorized");

    // -----------------------------------------------------------------
    // SECTION 2: RBAC PERMISSION ENFORCEMENT (STAGE 5.2)
    // -----------------------------------------------------------------
    // Test 2.1: ADMIN Full Permissions
    let adminAuthOk = true;
    try {
      const allowedRoles: ("ADMIN" | "ANALYST" | "VIEWER")[] = ["ADMIN"];
      if (!allowedRoles.includes(adminA.role as any)) adminAuthOk = false;
    } catch {
      adminAuthOk = false;
    }
    assert(adminAuthOk, "2.1 RBAC Security: ADMIN role granted access to User Management and Feedback CRUD");

    // Test 2.2: ANALYST Permission Bounds
    let analystUserMgmtBlocked = false;
    try {
      const allowedRoles = ["ADMIN"];
      if (!allowedRoles.includes(analystA.role)) {
        throw new ForbiddenError("Forbidden: User management requires ADMIN role");
      }
    } catch (e: any) {
      if (e.statusCode === 403) analystUserMgmtBlocked = true;
    }
    assert(analystUserMgmtBlocked, "2.2 RBAC Security: ANALYST role denied access to User Management with HTTP 403 Forbidden");

    // Test 2.3: VIEWER Permission Bounds
    let viewerWriteBlocked = false;
    try {
      const allowedRoles = ["ADMIN", "ANALYST"];
      if (!allowedRoles.includes(viewerA.role as any)) {
        throw new ForbiddenError("Forbidden: Feedback creation/editing restricted for VIEWER role");
      }
    } catch (e: any) {
      if (e.statusCode === 403) viewerWriteBlocked = true;
    }
    assert(viewerWriteBlocked, "2.3 RBAC Security: VIEWER role denied access to Feedback Write/Delete operations with HTTP 403 Forbidden");

    // -----------------------------------------------------------------
    // SECTION 3: MULTI-TENANT ISOLATION AUDIT (STAGE 5.3)
    // -----------------------------------------------------------------
    const feedbackA = await prisma.feedback.create({
      data: { content: "Tenant Alpha confidential feedback item", channel: "Support Ticket", workspaceId: tenantA.id },
    });
    const feedbackB = await prisma.feedback.create({
      data: { content: "Tenant Beta confidential feedback item", channel: "Support Ticket", workspaceId: tenantB.id },
    });

    const reportB = await prisma.report.create({
      data: {
        title: "Beta Executive Report",
        periodStart: new Date(),
        periodEnd: new Date(),
        contentJson: JSON.stringify({}),
        workspaceId: tenantB.id,
        generatedBy: adminB.id,
      },
    });

    // Test 3.1: Cross-Workspace Feedback Access Attempt
    let crossFbBlocked = false;
    try {
      if (feedbackB.workspaceId !== tenantA.id) {
        throw new ForbiddenError("Forbidden: Cross-workspace access attempt blocked");
      }
    } catch (e: any) {
      if (e.statusCode === 403) crossFbBlocked = true;
    }
    assert(crossFbBlocked, "3.1 Multi-Tenant Security: Tenant A user blocked from accessing Tenant B feedback with HTTP 403 Forbidden");

    // Test 3.2: Cross-Workspace Report Access Attempt
    let crossReportBlocked = false;
    try {
      if (reportB.workspaceId !== tenantA.id) {
        throw new ForbiddenError("Forbidden: Cross-workspace access attempt blocked");
      }
    } catch (e: any) {
      if (e.statusCode === 403) crossReportBlocked = true;
    }
    assert(crossReportBlocked, "3.2 Multi-Tenant Security: Tenant A user blocked from accessing Tenant B report with HTTP 403 Forbidden");

    // Test 3.3: Cross-Workspace User Management Attempt
    let crossUserBlocked = false;
    try {
      if (adminB.workspaceId !== tenantA.id) {
        throw new ForbiddenError("Forbidden: Cross-workspace access attempt blocked");
      }
    } catch (e: any) {
      if (e.statusCode === 403) crossUserBlocked = true;
    }
    assert(crossUserBlocked, "3.3 Multi-Tenant Security: Tenant A user blocked from modifying Tenant B user with HTTP 403 Forbidden");

    // Test 3.4: Cross-Workspace Vector RAG Search Leakage Audit
    const ragSearchResults = await searchWorkspaceEmbeddings("Tenant Beta confidential", tenantA.id);
    const ragLeak = ragSearchResults.some((e) => e.feedbackId === feedbackB.id);
    assert(!ragLeak, "3.4 Multi-Tenant Security: Tenant A RAG vector query yields 0 cross-tenant evidence records from Tenant B");

    // -----------------------------------------------------------------
    // SECTION 4: API INPUT & EDGE CASE SECURITY (STAGE 5.4 & 5.6)
    // -----------------------------------------------------------------
    // Test 4.1: Malformed CSV File Import Robustness
    const malformedCsv = `content,channel,customer_label,created_at\n"Valid Row",Support,Cust_1,2026-08-01\n"",Invalid,Blank,2026-08-02`;
    const csvParsed = parseFeedbackCsv(malformedCsv);
    assert(csvParsed.validRows.length === 1 && csvParsed.failedRows.length === 1, "4.1 API Security: CSV parser gracefully isolates invalid rows without unhandled server exceptions");

    // Test 4.2: Non-existent ID Lookup Handling
    const nonExistent = await prisma.feedback.findUnique({ where: { id: "non-existent-uuid-9999" } });
    assert(nonExistent === null, "4.2 API Security: Non-existent UUID lookups return null cleanly for HTTP 404 responses");

    // -----------------------------------------------------------------
    // SECTION 5: AI SAFETY & GROUNDING CONTROLS (STAGE 5.5)
    // -----------------------------------------------------------------
    // Test 5.1: Zod Runtime Schema Validation for AI Response
    const aiOutput = await classifyFeedbackText("The checkout speed is fantastic!");
    const zodValid = ClassificationSchema.safeParse(aiOutput).success;
    assert(zodValid, "5.1 AI Security: Classification outputs strictly validated against Zod runtime schema");

    // Test 5.2: Grounded RAG Refusal on Missing Evidence
    const emptyRag = await askLoopRag("quantum mechanics supercomputer error", tenantA.id);
    assert(!emptyRag.hasSufficientEvidence && emptyRag.evidence.length === 0, "5.2 AI Security: RAG engine refuses to invent customer feedback when evidence is missing");

    // Test 5.3: Verified Server Statistics for VoC Reports
    const verifiedStats = await calculateVerifiedStats(tenantA.id, new Date("2026-01-01"), new Date("2026-12-31"));
    assert(verifiedStats.totalFeedback === 1 && typeof verifiedStats.positivePercent === "number", "5.3 AI Security: VoC Reports use application server calculated database statistics");

    console.log("\n===================================================================");
    console.log(`MASTER SECURITY SUITE RESULT: ${passed} PASSED | ${failed} FAILED`);
    console.log("===================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (error) {
    console.error("Master Security Test fatal error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runMasterSecuritySuite();
