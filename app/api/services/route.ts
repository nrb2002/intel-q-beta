// app/api/services/route.ts

import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/authorization";

// GET /api/services
//
// PUBLIC
//
// Customers can view available services without
// authentication.
//
// STAFF and ADMIN can also access this endpoint.

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(services, {
      status: 200,
    });
  } catch (error) {
    console.error(
      "GET /api/services error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to load services.",
      },
      {
        status: 500,
      },
    );
  }
}

// POST /api/services
//
// ADMIN ONLY
//
// Service configuration is an administrative
// operation.

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

    /*
     * IMPORTANT
     *
     * The authorization requirement is now complete:
     *
     * Anonymous → 401
     * CUSTOMER  → 403
     * STAFF     → 403
     * ADMIN     → allowed
     *
     * Your existing service validation and Prisma
     * creation logic should follow here.
     */

    return NextResponse.json(
      {
        error: "Service creation is not implemented yet.",
      },
      {
        status: 501,
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
      "POST /api/services error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to create service.",
      },
      {
        status: 500,
      },
    );
  }
}