// app/api/branches/[id]/route.tsx

import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createBranchSchema } from "@/lib/validations/branch";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

function isStaffOrAdmin(role: unknown) {
  return role === "STAFF" || role === "ADMIN";
}

// GET /api/branches/[id]

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Branch ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const branch = await prisma.branch.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            queueTickets: true,
          },
        },
      },
    });

    if (!branch) {
      return NextResponse.json(
        {
          error: "Branch not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      id: branch.id,
      name: branch.name,
      address: branch.address,
      city: branch.city,
      queueTicketCount: branch._count.queueTickets,
      createdAt: branch.createdAt.toISOString(),
      updatedAt: branch.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("GET /api/branches/[id] error:", error);

    return NextResponse.json(
      {
        error: "Unable to load the branch. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}

// PATCH /api/branches/[id]
// STAFF and ADMIN only.

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    if (!isStaffOrAdmin(session.user.role)) {
      return NextResponse.json(
        {
          error: "You do not have permission to update branches.",
        },
        {
          status: 403,
        },
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Branch ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const existingBranch = await prisma.branch.findUnique({
      where: {
        id,
      },
    });

    if (!existingBranch) {
      return NextResponse.json(
        {
          error: "Branch not found.",
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

    const result = createBranchSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (typeof field === "string" && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }

      return NextResponse.json(
        {
          error: "Please correct the highlighted fields.",
          fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const branch = await prisma.branch.update({
      where: {
        id,
      },
      data: {
        name: result.data.name.trim(),
        address: result.data.address.trim(),
        city: result.data.city.trim(),
      },
      include: {
        _count: {
          select: {
            queueTickets: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Branch updated successfully.",
      branch: {
        id: branch.id,
        name: branch.name,
        address: branch.address,
        city: branch.city,
        queueTicketCount: branch._count.queueTickets,
        createdAt: branch.createdAt.toISOString(),
        updatedAt: branch.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("PATCH /api/branches/[id] error:", error);

    return NextResponse.json(
      {
        error: "Unable to update the branch. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}

// DELETE /api/branches/[id]
// STAFF and ADMIN only.

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    if (!isStaffOrAdmin(session.user.role)) {
      return NextResponse.json(
        {
          error: "You do not have permission to delete branches.",
        },
        {
          status: 403,
        },
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Branch ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const branch = await prisma.branch.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            queueTickets: true,
          },
        },
      },
    });

    if (!branch) {
      return NextResponse.json(
        {
          error: "Branch not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (branch._count.queueTickets > 0) {
      return NextResponse.json(
        {
          error: "This branch cannot be deleted because it has queue tickets associated with it.",
        },
        {
          status: 409,
        },
      );
    }

    await prisma.branch.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Branch deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/branches/[id] error:", error);

    return NextResponse.json(
      {
        error: "Unable to delete the branch. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}
