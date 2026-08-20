// app/api/services/[id]/route.ts

import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/authorization";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

function handleAuthorizationError(error: unknown) {
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

  return null;
}

// GET /api/services/[id]
//
// PUBLIC
//
// Customers can view individual services without
// authentication.

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const service = await prisma.service.findUnique({
      where: {
        id,
      },
    });

    if (!service) {
      return NextResponse.json(
        {
          error: "Service not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(service, {
      status: 200,
    });
  } catch (error) {
    console.error(
      "GET /api/services/[id] error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to load service.",
      },
      {
        status: 500,
      },
    );
  }
}

// PATCH /api/services/[id]
//
// ADMIN ONLY
//
// Service configuration is an administrative
// operation.

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    await requireRole("ADMIN");

    const { id } = await context.params;

    const existingService =
      await prisma.service.findUnique({
        where: {
          id,
        },
      });

    if (!existingService) {
      return NextResponse.json(
        {
          error: "Service not found.",
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

    /*
     * Milestone 02 authorization is complete.
     *
     * The actual Service update should use the
     * project's existing Service validation schema.
     *
     * Do not accept arbitrary fields directly from
     * the request body.
     */

    return NextResponse.json(
      {
        error:
          "Service update validation and persistence are not implemented yet.",
      },
      {
        status: 501,
      },
    );
  } catch (error) {
    const authorizationResponse =
      handleAuthorizationError(error);

    if (authorizationResponse) {
      return authorizationResponse;
    }

    console.error(
      "PATCH /api/services/[id] error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to update service.",
      },
      {
        status: 500,
      },
    );
  }
}

// DELETE /api/services/[id]
//
// ADMIN ONLY
//
// Service deletion is an administrative
// operation.

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  try {
    await requireRole("ADMIN");

    const { id } = await context.params;

    const service =
      await prisma.service.findUnique({
        where: {
          id,
        },
      });

    if (!service) {
      return NextResponse.json(
        {
          error: "Service not found.",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.service.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        message: "Service deleted successfully.",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    const authorizationResponse =
      handleAuthorizationError(error);

    if (authorizationResponse) {
      return authorizationResponse;
    }

    console.error(
      "DELETE /api/services/[id] error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to delete service.",
      },
      {
        status: 500,
      },
    );
  }
}