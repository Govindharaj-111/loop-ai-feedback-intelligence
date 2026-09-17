import { Request } from "express";
import { COOKIE_NAME, verifyToken } from "./session.js";
import { prisma } from "./prisma.js";
import { Role, SessionUser } from "../types/index.js";

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
 * Returns the authenticated user session from HTTP-only cookie or Authorization header.
 * NEVER accepts workspaceId from client request body, query params, or URL.
 */
export async function getCurrentUser(req?: Request): Promise<SessionUser | null> {
  if (!req) return null;
  try {
    let token = req.cookies?.[COOKIE_NAME];
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload || !payload.sub || !payload.workspaceId) return null;

    return {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      workspaceId: payload.workspaceId,
      workspaceName: payload.workspaceName,
    };
  } catch {
    return null;
  }
}

/**
 * Returns the current workspace for the authenticated session user.
 */
export async function getCurrentWorkspace(req?: Request) {
  const user = await getCurrentUser(req);
  if (!user) return null;

  const workspace = await prisma.workspace.findUnique({
    where: { id: user.workspaceId },
  });

  return workspace;
}

/**
 * Asserts that a user is authenticated. Throws AuthError (401) if not logged in.
 */
export async function requireAuth(req?: Request): Promise<SessionUser> {
  const user = await getCurrentUser(req);
  if (!user) {
    throw new AuthError("Unauthorized: Authentication required", 401);
  }
  return user;
}

/**
 * Asserts that the authenticated user possesses one of the allowed roles.
 * Throws ForbiddenError (403) if role is insufficient.
 */
export async function requireRole(allowedRoles: Role[], req?: Request): Promise<SessionUser> {
  const user = await requireAuth(req);
  if (!allowedRoles.includes(user.role)) {
    throw new ForbiddenError(`Forbidden: Action requires role ${allowedRoles.join(" or ")}, but user is ${user.role}`);
  }
  return user;
}

/**
 * Validates workspace access against the authenticated server-side session.
 * Prevents cross-workspace access attempts. Throws ForbiddenError (403) on mismatch.
 */
export async function requireWorkspaceAccess(targetWorkspaceId: string, req?: Request): Promise<SessionUser> {
  const user = await requireAuth(req);
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
