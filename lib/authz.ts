// lib/authz.ts

import { auth } from "@/lib/auth";
import type { UserRole } from "@/types/user";

/**
 * Authorization error used by protected server-side
 * operations and API route handlers.
 */
export class AuthorizationError extends Error {
  status: 401 | 403;

  constructor(
    message: string,
    status: 401 | 403,
  ) {
    super(message);
    this.name = "AuthorizationError";
    this.status = status;
  }
}

/**
 * Get the currently authenticated session.
 *
 * Returns null when there is no authenticated user.
 *
 * This function does not enforce a specific role.
 */
export async function getCurrentSession() {
  return auth();
}

/**
 * Require an authenticated user.
 *
 * Throws:
 * - 401 when the user is not authenticated.
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new AuthorizationError(
      "Authentication required.",
      401,
    );
  }

  return session;
}

/**
 * Check whether a role is included in a list of allowed roles.
 */
export function hasRole(
  role: UserRole | undefined,
  allowedRoles: UserRole[],
): boolean {
  if (!role) {
    return false;
  }

  return allowedRoles.includes(role);
}

/**
 * Require the current user to have one of the supplied roles.
 *
 * Throws:
 * - 401 when the user is not authenticated.
 * - 403 when the user is authenticated but does not
 *       have the required role.
 */
export async function requireRole(
  allowedRoles: UserRole[],
) {
  const session = await requireAuth();

  const role = session.user.role;

  if (!hasRole(role, allowedRoles)) {
    throw new AuthorizationError(
      "You do not have permission to perform this action.",
      403,
    );
  }

  return session;
}

/**
 * Require STAFF or ADMIN access.
 *
 * STAFF:
 * - Can operate queues.
 * - Can call tickets.
 * - Can transition tickets.
 * - Can perform permitted operational actions.
 *
 * ADMIN:
 * - Has all STAFF access.
 * - Can perform administrative configuration.
 */
export async function requireStaff() {
  return requireRole(["STAFF", "ADMIN"]);
}

/**
 * Require ADMIN access.
 *
 * Only ADMIN users may perform administrator-only
 * operations.
 */
export async function requireAdmin() {
  return requireRole(["ADMIN"]);
}

/**
 * Convert an authorization error into a standard
 * API response payload.
 *
 * This helper is intended for API route handlers.
 */
export function getAuthorizationErrorResponse(
  error: unknown,
) {
  if (error instanceof AuthorizationError) {
    return {
      error: error.message,
      status: error.status,
    };
  }

  return null;
}