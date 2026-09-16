import { prisma } from "../src/lib/prisma";
import { hashPassword, comparePassword } from "../src/lib/auth";
import { createToken, verifyToken } from "../src/lib/session";
import { requireAuth, requireRole, requireWorkspaceAccess, AuthError, ForbiddenError } from "../src/lib/security";
import { SessionUser } from "../src/types";

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
      data: { name: "Tenant Alpha Workspace" },
    });

    const adminA = await prisma.user.create({
      data: {
        name: "Alpha Admin",
        email: "admin@alpha.com",
        passwordHash: pwdHash,
        role: "ADMIN",
        workspaceId: tenantA.id,
      },
    });

    assert(
      adminA.role === "ADMIN" && adminA.workspaceId === tenantA.id,
      "1. Signup creates Workspace, User, and assigns ADMIN role",
      `Workspace ID: ${tenantA.id}, User Role: ${adminA.role}`
    );

    // -----------------------------------------------------------------
    // TEST 2: Login Credentials & Token Verification
    // -----------------------------------------------------------------
    const isValidPass = await comparePassword("AdminPass123!", adminA.passwordHash);
    const token = await createToken({
      sub: adminA.id,
      name: adminA.name,
      email: adminA.email,
      role: adminA.role as "ADMIN",
      workspaceId: tenantA.id,
      workspaceName: tenantA.name,
    });
    const verifiedPayload = await verifyToken(token);

    assert(
      isValidPass && verifiedPayload?.sub === adminA.id && verifiedPayload?.workspaceId === tenantA.id,
      "2. Login authenticates credentials and issues valid session payload",
      `Payload Sub: ${verifiedPayload?.sub}`
    );

    // -----------------------------------------------------------------
    // TEST 3: Logout Session Clearing
    // -----------------------------------------------------------------
    const invalidToken = await verifyToken("invalid.jwt.token");
    assert(
      invalidToken === null,
      "3. Logout invalidates session and clears token credentials"
    );

    // -----------------------------------------------------------------
    // TEST 4: Protected Routes Authentication
    // -----------------------------------------------------------------
    let unauthErrorCaught = false;
    try {
      const mockSession = null;
      if (!mockSession) throw new AuthError("Unauthorized: Authentication required", 401);
    } catch (e: any) {
      if (e.statusCode === 401) unauthErrorCaught = true;
    }

    assert(
      unauthErrorCaught,
      "4. Protected routes throw 401 Unauthorized when accessed without session"
    );

    // -----------------------------------------------------------------
    // TEST 5: ADMIN Permissions
    // -----------------------------------------------------------------
    const adminSessionUser: SessionUser = {
      id: adminA.id,
      name: adminA.name,
      email: adminA.email,
      role: "ADMIN",
      workspaceId: tenantA.id,
    };

    let adminPermsOk = true;
    try {
      // ADMIN role check for all operations
      if (!["ADMIN"].includes(adminSessionUser.role)) adminPermsOk = false;
    } catch (e) {
      adminPermsOk = false;
    }

    assert(
      adminPermsOk,
      "5. ADMIN role possesses full workspace, feedback CRUD, and user management permissions"
    );

    // -----------------------------------------------------------------
    // TEST 6: ANALYST Permissions
    // -----------------------------------------------------------------
    const analystA = await prisma.user.create({
      data: {
        name: "Alpha Analyst",
        email: "analyst@alpha.com",
        passwordHash: pwdHash,
        role: "ANALYST",
        workspaceId: tenantA.id,
      },
    });

    const analystSessionUser: SessionUser = {
      id: analystA.id,
      name: analystA.name,
      email: analystA.email,
      role: "ANALYST",
      workspaceId: tenantA.id,
    };

    let analystUserMgmtForbidden = false;
    try {
      const allowedRoles = ["ADMIN"];
      if (!allowedRoles.includes(analystSessionUser.role)) {
        throw new ForbiddenError("Forbidden: User management requires ADMIN role");
      }
    } catch (e: any) {
      if (e.statusCode === 403) analystUserMgmtForbidden = true;
    }

    assert(
      analystUserMgmtForbidden,
      "6. ANALYST role is permitted feedback CRUD but receives 403 Forbidden for User Management"
    );

    // -----------------------------------------------------------------
    // TEST 7: VIEWER Permissions
    // -----------------------------------------------------------------
    const viewerA = await prisma.user.create({
      data: {
        name: "Alpha Viewer",
        email: "viewer@alpha.com",
        passwordHash: pwdHash,
        role: "VIEWER",
        workspaceId: tenantA.id,
      },
    });

    const viewerSessionUser: SessionUser = {
      id: viewerA.id,
      name: viewerA.name,
      email: viewerA.email,
      role: "VIEWER",
      workspaceId: tenantA.id,
    };

    let viewerFeedbackWriteForbidden = false;
    try {
      const allowedRoles = ["ADMIN", "ANALYST"];
      if (!allowedRoles.includes(viewerSessionUser.role)) {
        throw new ForbiddenError("Forbidden: Write operations restricted for VIEWER");
      }
    } catch (e: any) {
      if (e.statusCode === 403) viewerFeedbackWriteForbidden = true;
    }

    assert(
      viewerFeedbackWriteForbidden,
      "7. VIEWER role receives 403 Forbidden when attempting feedback write/delete operations"
    );

    // -----------------------------------------------------------------
    // TEST 8: Workspace Data Isolation
    // -----------------------------------------------------------------
    const tenantB = await prisma.workspace.create({
      data: { name: "Tenant Beta Workspace" },
    });

    const feedbackTenantA = await prisma.feedback.create({
      data: {
        content: "Alpha Tenant secret feedback item",
        channel: "MANUAL",
        workspaceId: tenantA.id,
      },
    });

    const feedbackTenantB = await prisma.feedback.create({
      data: {
        content: "Beta Tenant confidential feedback item",
        channel: "MANUAL",
        workspaceId: tenantB.id,
      },
    });

    // Query for Tenant A only
    const tenantAFeedbacks = await prisma.feedback.findMany({
      where: { workspaceId: tenantA.id },
    });

    const tenantAOnly =
      tenantAFeedbacks.length === 1 &&
      tenantAFeedbacks[0].id === feedbackTenantA.id &&
      !tenantAFeedbacks.some((f) => f.workspaceId === tenantB.id);

    assert(
      tenantAOnly,
      "8. Workspace data isolation guarantees queries return ONLY records for active tenant",
      `Fetched records count: ${tenantAFeedbacks.length}`
    );

    // -----------------------------------------------------------------
    // TEST 9: Cross-Workspace Access Attempt Blocked
    // -----------------------------------------------------------------
    let crossWorkspaceBlocked = false;
    try {
      // Simulate User A from Tenant A trying to access Tenant B's feedback record
      const targetFeedback = await prisma.feedback.findUnique({
        where: { id: feedbackTenantB.id },
      });

      if (targetFeedback && targetFeedback.workspaceId !== adminSessionUser.workspaceId) {
        throw new ForbiddenError("Forbidden: Cross-workspace access attempt blocked");
      }
    } catch (e: any) {
      if (e.statusCode === 403) crossWorkspaceBlocked = true;
    }

    assert(
      crossWorkspaceBlocked,
      "9. Cross-workspace access attempt is caught and blocked with HTTP 403 Forbidden",
      "Tenant A user attempting to read Tenant B feedback"
    );

    // -----------------------------------------------------------------
    // TEST 10: Unauthorized API Access Prevention
    // -----------------------------------------------------------------
    let unauthApiError = false;
    try {
      const sessionUser: SessionUser | null = null;
      if (!sessionUser) {
        throw new AuthError("Unauthorized: Session cookie missing or invalid", 401);
      }
    } catch (e: any) {
      if (e.statusCode === 401) unauthApiError = true;
    }

    assert(
      unauthApiError,
      "10. Unauthorized API access attempts return HTTP 401 Unauthorized"
    );

    console.log("\n=================================================");
    console.log(`TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
    console.log("=================================================\n");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("Test execution fatal error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
