import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/authorization";
import { UserRole } from "@/generated/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/users/[id]
//
// ADMIN only.
//
// Returns a single user without exposing
// the password hash.

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    await requireRole("ADMIN");

    const { id } = await context.params;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      return NextResponse.json(
        {
          error:
            "Forbidden. Administrator access required.",
        },
        {
          status: 403,
        },
      );
    }

    console.error(
      "GET /api/users/[id] error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to load user.",
      },
      {
        status: 500,
      },
    );
  }
}

// PATCH /api/users/[id]
//
// ADMIN only.
//
// Administrators can update:
// - firstName
// - lastName
// - email
// - password
// - role
//
// Password is always hashed before storage.

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const session = await requireRole("ADMIN");

    const { id } = await context.params;

    const existingUser =
      await prisma.user.findUnique({
        where: {
          id,
        },
      });

    if (!existingUser) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        },
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid request data.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          error: "Invalid request data.",
        },
        {
          status: 400,
        },
      );
    }

    const data = body as Record<
      string,
      unknown
    >;

    const firstName =
      typeof data.firstName === "string"
        ? data.firstName.trim()
        : undefined;

    const lastName =
      typeof data.lastName === "string"
        ? data.lastName.trim()
        : undefined;

    const email =
      typeof data.email === "string"
        ? data.email.trim().toLowerCase()
        : undefined;

    const password =
      typeof data.password === "string"
        ? data.password
        : undefined;

    const role =
      typeof data.role === "string"
        ? data.role
        : undefined;

    const fieldErrors: Record<
      string,
      string
    > = {};

    if (
      data.firstName !== undefined &&
      !firstName
    ) {
      fieldErrors.firstName =
        "First name is required.";
    }

    if (
      data.lastName !== undefined &&
      !lastName
    ) {
      fieldErrors.lastName =
        "Last name is required.";
    }

    if (email !== undefined) {
      if (!email) {
        fieldErrors.email =
          "Email address is required.";
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          email,
        )
      ) {
        fieldErrors.email =
          "Please enter a valid email address.";
      }
    }

    if (
      password !== undefined &&
      password.length < 8
    ) {
      fieldErrors.password =
        "Password must be at least 8 characters.";
    }

    if (
      role !== undefined &&
      !Object.values(UserRole).includes(
        role as UserRole,
      )
    ) {
      fieldErrors.role =
        "Please select a valid user role.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        {
          error:
            "Please correct the highlighted fields.",
          fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Prevent duplicate email addresses.
     */
    if (
      email !== undefined &&
      email !== existingUser.email
    ) {
      const emailOwner =
        await prisma.user.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
          },
        });

      if (
        emailOwner &&
        emailOwner.id !== id
      ) {
        return NextResponse.json(
          {
            error:
              "A user with this email address already exists.",

            fieldErrors: {
              email:
                "This email address is already registered.",
            },
          },
          {
            status: 409,
          },
        );
      }
    }

    /*
     * Prevent an administrator from accidentally
     * removing their own ADMIN role.
     */
    if (
      id === session.user.id &&
      role !== undefined &&
      role !== "ADMIN"
    ) {
      return NextResponse.json(
        {
          error:
            "You cannot remove administrator access from your own account.",
        },
        {
          status: 403,
        },
      );
    }

    /*
     * Prevent an administrator from changing
     * their own email to an empty/invalid value.
     *
     * Validation above already handles this, so
     * this section intentionally remains simple.
     */

    const updateData: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      role?: UserRole;
    } = {};

    if (firstName !== undefined) {
      updateData.firstName = firstName;
    }

    if (lastName !== undefined) {
      updateData.lastName = lastName;
    }

    if (email !== undefined) {
      updateData.email = email;
    }

    if (role !== undefined) {
      updateData.role = role as UserRole;
    }

    /*
     * Hash passwords before storing them.
     */
    if (password !== undefined) {
      updateData.password =
        await bcrypt.hash(password, 12);
    }

    const updatedUser =
      await prisma.user.update({
        where: {
          id,
        },

        data: updateData,

        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return NextResponse.json(
      {
        message: "User updated successfully.",

        user: {
          id: updatedUser.id,
          firstName:
            updatedUser.firstName,
          lastName:
            updatedUser.lastName,
          email: updatedUser.email,
          role: updatedUser.role,
          createdAt:
            updatedUser.createdAt.toISOString(),
          updatedAt:
            updatedUser.updatedAt.toISOString(),
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      return NextResponse.json(
        {
          error:
            "Forbidden. Administrator access required.",
        },
        {
          status: 403,
        },
      );
    }

    /*
     * Prisma unique constraint violation.
     */
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          error:
            "A user with this email address already exists.",
        },
        {
          status: 409,
        },
      );
    }

    console.error(
      "PATCH /api/users/[id] error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to update user.",
      },
      {
        status: 500,
      },
    );
  }
}

// DELETE /api/users/[id]
//
// ADMIN only.
//
// Administrators can delete users.
//
// An administrator cannot delete their own
// currently authenticated account.

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  try {
    const session = await requireRole("ADMIN");

    const { id } = await context.params;

    /*
     * Prevent self-deletion.
     */
    if (id === session.user.id) {
      return NextResponse.json(
        {
          error:
            "You cannot delete your own administrator account.",
        },
        {
          status: 403,
        },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * Delete the user.
     *
     * QueueTicket.customerId should be nullable
     * with onDelete: SetNull in the current
     * public-ticket architecture.
     */
    await prisma.user.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        message: "User deleted successfully.",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      return NextResponse.json(
        {
          error:
            "Forbidden. Administrator access required.",
        },
        {
          status: 403,
        },
      );
    }

    /*
     * Foreign-key protection.
     *
     * This can occur if the database schema still
     * prevents deletion of a user referenced by tickets.
     */
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        {
          error:
            "This user cannot be deleted because they are referenced by existing records.",
        },
        {
          status: 409,
        },
      );
    }

    console.error(
      "DELETE /api/users/[id] error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to delete user.",
      },
      {
        status: 500,
      },
    );
  }
}