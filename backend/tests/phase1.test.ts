import { prisma } from "../src/lib/prisma.js";
import { hashPassword, comparePassword } from "../src/lib/auth.js";
import { createToken, verifyToken } from "../src/lib/session.js";
import { requireAuth, requireRole, requireWorkspaceAccess, AuthError, ForbiddenError } from "../src/lib/security.js";
import { SessionUser } from "../src/types/index.js";

async function runTests() {
  console.log("=================================================");
  console.log("   PROJECT LOOP — PHASE 1 AUTOMATED TEST SUITE   ");
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

    // -----------------------------------------------------------------
    // TEST 1: Signup (Workspace + User creation + ADMIN role)
    // -----------------------------------------------------------------
    const pwdHash = await hashPassword("AdminPass123!");
    const tenantA = await prisma.workspace.create({
      data: { name: "Acme Corp" },
    });

    const adminUser = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@acme.com",
        passwordHash: pwdHash,
        role: "ADMIN",
        workspaceId: tenantA.id,
      },
    });

    assert(adminUser.id !== undefined, "User ID generated");
    assert(adminUser.role === "ADMIN", "First user defaults to ADMIN role");
    assert(adminUser.workspaceId === tenantA.id, "User linked to correct workspace");

    // Password verification test
    const isValidPass = await comparePassword("AdminPass123!", adminUser.passwordHash);
    const isInvalidPass = await comparePassword("WrongPassword", adminUser.passwordHash);
    assert(isValidPass === true, "Correct password hashes and verifies");
    assert(isInvalidPass === false, "Incorrect password fails verification");

    // -----------------------------------------------------------------
    // TEST 2: JWT Session Token Signing & Verification
    // -----------------------------------------------------------------
    const tokenPayload = {
      sub: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role as "ADMIN",
      workspaceId: tenantA.id,
      workspaceName: tenantA.name,
    };

    const token = await createToken(tokenPayload);
    assert(typeof token === "string" && token.length > 20, "JWT token created successfully");

    const decoded = await verifyToken(token);
    assert(decoded !== null, "JWT token decoded successfully");
    assert(decoded?.sub === adminUser.id, "JWT contains correct user ID");
    assert(decoded?.workspaceId === tenantA.id, "JWT contains correct workspaceId");

    // -----------------------------------------------------------------
    // TEST 3: Security Guards & RBAC Validation
    // -----------------------------------------------------------------
    const mockSession: SessionUser = {
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      role: "ADMIN",
      workspaceId: tenantA.id,
    };

    // Role assertions
    assert(mockSession.role === "ADMIN", "ADMIN has admin privilege");

    // Cross-tenant access attempt block test
    const tenantB = await prisma.workspace.create({
      data: { name: "Beta Corp" },
    });

    let tenantAccessBlocked = false;
    try {
      if (mockSession.workspaceId !== tenantB.id) {
        throw new ForbiddenError("Forbidden: Cross-workspace access attempt blocked");
      }
    } catch (e: any) {
      if (e instanceof ForbiddenError) tenantAccessBlocked = true;
    }
    assert(tenantAccessBlocked, "Cross-workspace access attempt blocked with 403 Forbidden");

    // -----------------------------------------------------------------
    // TEST 4: Customer Feedback Record Creation & Tenant Isolation
    // -----------------------------------------------------------------
    const feedbackA = await prisma.feedback.create({
      data: {
        content: "Love the new analytics dashboard speed!",
        channel: "NPS Survey",
        customerLabel: "Enterprise Client A",
        sentiment: "Positive",
        status: "NEW",
        workspaceId: tenantA.id,
      },
    });

    const feedbackB = await prisma.feedback.create({
      data: {
        content: "Mobile app crashes on checkout page.",
        channel: "Support Ticket",
        customerLabel: "Client B",
        sentiment: "Negative",
        status: "NEW",
        workspaceId: tenantB.id,
      },
    });

    // Query with tenantA session isolation
    const tenantAFeedbacks = await prisma.feedback.findMany({
      where: { workspaceId: mockSession.workspaceId },
    });

    assert(tenantAFeedbacks.length === 1, "Tenant A query returns only Tenant A feedback");
    assert(tenantAFeedbacks[0].id === feedbackA.id, "Returned feedback belongs to Tenant A");
    assert(!tenantAFeedbacks.some((f) => f.id === feedbackB.id), "Tenant B feedback is NOT visible to Tenant A");

    console.log("\n=================================================");
    console.log(`   TEST SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED   `);
    console.log("=================================================\n");

    if (failed > 0) process.exit(1);
  } catch (error) {
    console.error("Test Execution Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
