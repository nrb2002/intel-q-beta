import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/authorization";
import { updateProfileSchema } from "@/lib/validations/profile";

// GET /api/users/me
//
// Any authenticated user can view their own profile.
// CUSTOMER, STAFF, and ADMIN are allowed.
//
// Unauthenticated users receive 401.

export async function GET() {
  try {
    const session = await requireAuth();

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
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

    console.error(
      "GET /api/users/me error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load your profile. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}

// PATCH /api/users/me
//
// Any authenticated user can update their own profile.
//
// CUSTOMER → allowed
// STAFF    → allowed
// ADMIN    → allowed
//
// Users cannot change their:
// - role
// - email
// - password
// - id

export async function PATCH(request: Request) {
  try {
    const session = await requireAuth();

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

    const result =
      updateProfileSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors: Record<
        string,
        string
      > = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (
          typeof field === "string" &&
          !fieldErrors[field]
        ) {
          fieldErrors[field] = issue.message;
        }
      }

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

    const {
      firstName,
      lastName,
    } = result.data;

    const updatedUser =
      await prisma.user.update({
        where: {
          id: session.user.id,
        },

        data: {
          firstName,
          lastName,
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

    return NextResponse.json(
      {
        message:
          "Your profile has been updated successfully.",

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

    console.error(
      "PATCH /api/users/me error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to update your profile. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}