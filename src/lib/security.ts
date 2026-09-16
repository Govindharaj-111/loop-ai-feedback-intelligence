import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Role, SessionUser } from "@/types";

export class AuthError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AuthError";
  }
}

export class ForbiddenError extends Error {
  statusCode: number;
  constructor(message: string = "Forbidden: Insufficient permissions for this operation") {
    super(message);
    this.statusCode = 403;
    this.name = "ForbiddenError";
  }
}

/**
 * Returns the authenticated user session from HTTP-only cookie.
 * NEVER accepts workspaceId from client request body, query params, or URL.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  return await getSession();
}

/**
 * Returns the current workspace for the authenticated session user.
 */
export async function getCurrentWorkspace() {
  const user = await getCurrentUser();
  if (!user) return null;

  const workspace = await prisma.workspace.findUnique({
    where: { id: user.workspaceId },
  });

  return workspace;
}

/**
 * Asserts that a user is authenticated. Throws AuthError (401) if not logged in.
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthError("Unauthorized: Authentication required", 401);
  }
  return user;
}

/**
 * Asserts that the authenticated user possesses one of the allowed roles.
 * Throws ForbiddenError (403) if role is insufficient.
 */
export async function requireRole(allowedRoles: Role[]): Promise<SessionUser> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new ForbiddenError(`Forbidden: Action requires role ${allowedRoles.join(" or ")}, but user is ${user.role}`);
  }
  return user;
}

/**
 * Validates workspace access against the authenticated server-side session.
 * Prevents cross-workspace access attempts. Throws ForbiddenError (403) on mismatch.
 */
export async function requireWorkspaceAccess(targetWorkspaceId: string): Promise<SessionUser> {
  const user = await requireAuth();
  if (user.workspaceId !== targetWorkspaceId) {
    throw new ForbiddenError("Forbidden: Cross-workspace access attempt blocked");
  }
  return user;
}

/**
 * Utility helper to build tenant-scoped Prisma query filters.
 * Guarantees workspaceId filtering is unconditionally injected.
 */
export function tenantWhere<T extends object>(session: SessionUser, additionalWhere?: T) {
  return {
    ...additionalWhere,
    workspaceId: session.workspaceId,
  };
}
