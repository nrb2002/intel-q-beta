import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/authorization";
import { UserRole } from "@/generated/prisma";

// GET /api/users
//
// ADMIN only.
//
// Returns all users without exposing password hashes.

export async function GET() {
  try {
    await requireRole("ADMIN");

    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        users: users.map((user) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        })),
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
      "GET /api/users error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to load users.",
      },
      {
        status: 500,
      },
    );
  }
}

// POST /api/users
//
// ADMIN only.
//
// Creates a new user.
//
// Expected body:
//
// {
//   firstName: string,
//   lastName: string,
//   email: string,
//   password: string,
//   role: "CUSTOMER" | "STAFF" | "ADMIN"
// }

export async function POST(request: Request) {
  try {
    await requireRole("ADMIN");

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

    const data = body as Record<string, unknown>;

    const firstName =
      typeof data.firstName === "string"
        ? data.firstName.trim()
        : "";

    const lastName =
      typeof data.lastName === "string"
        ? data.lastName.trim()
        : "";

    const email =
      typeof data.email === "string"
        ? data.email.trim().toLowerCase()
        : "";

    const password =
      typeof data.password === "string"
        ? data.password
        : "";

    const role =
      typeof data.role === "string"
        ? data.role
        : "CUSTOMER";

    const fieldErrors: Record<
      string,
      string
    > = {};

    if (!firstName) {
      fieldErrors.firstName =
        "First name is required.";
    }

    if (!lastName) {
      fieldErrors.lastName =
        "Last name is required.";
    }

    if (!email) {
      fieldErrors.email =
        "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      fieldErrors.email =
        "Please enter a valid email address.";
    }

    if (!password) {
      fieldErrors.password =
        "Password is required.";
    } else if (password.length < 8) {
      fieldErrors.password =
        "Password must be at least 8 characters.";
    }

    if (
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
     * Prevent duplicate accounts.
     */
    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            "A user with this email address already exists.",

          fieldErrors: {
            email: [
              "This email address is already registered.",
            ],
          },
        },
        {
          status: 409,
        },
      );
    }

    /*
     * Never store a plain-text password.
     */
    const hashedPassword =
      await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role as UserRole,
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
        message: "User created successfully.",

        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          createdAt:
            user.createdAt.toISOString(),
          updatedAt:
            user.updatedAt.toISOString(),
        },
      },
      {
        status: 201,
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
     * Prisma unique constraint protection.
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
      "POST /api/users error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to create user.",
      },
      {
        status: 500,
      },
    );
  }
}