// lib/auth/authorization.ts

import { auth } from "@/lib/auth";
import type { UserRole } from "@/types/user";

/**
 * Require an authenticated user.
 *
 * Throws an error when there is no active session.
 *
 * Use this in protected server-side operations.
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  return session;
}

/**
 * Require a specific user role.
 *
 * ADMIN is intentionally allowed to perform STAFF operations.
 *
 * Examples:
 *
 * requireRole("STAFF")
 * requireRole("ADMIN")
 */
export async function requireRole(
  requiredRole: UserRole,
) {
  const session = await requireAuth();

  const userRole = session.user.role;

  if (!userRole) {
    throw new Error("FORBIDDEN");
  }

  /*
   * Administrators have access to staff functionality.
   */
  if (
    requiredRole === "STAFF" &&
    userRole === "ADMIN"
  ) {
    return session;
  }

  if (userRole !== requiredRole) {
    throw new Error("FORBIDDEN");
  }

  return session;
}

/**
 * Require either STAFF or ADMIN.
 *
 * Useful for queue-management operations.
 */
export async function requireStaff() {
  const session = await requireAuth();

  const role = session.user.role;

  if (
    role !== "STAFF" &&
    role !== "ADMIN"
  ) {
    throw new Error("FORBIDDEN");
  }

  return session;
}

/**
 * Require ADMIN specifically.
 */
export async function requireAdmin() {
  return requireRole("ADMIN");
}
