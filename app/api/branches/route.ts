// app/api/branches/route.ts

import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createBranchSchema } from "@/lib/validations/branch";

// GET /api/branches
// Returns all branches for authenticated users.
export async function GET() {
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

    const branches = await prisma.branch.findMany({
      orderBy: [
        {
          name: "asc",
        },
        {
          city: "asc",
        },
      ],
      include: {
        _count: {
          select: {
            queueTickets: true,
          },
        },
      },
    });

    return NextResponse.json(
      branches.map((branch) => ({
        id: branch.id,
        name: branch.name,
        address: branch.address,
        city: branch.city,
        queueTicketCount: branch._count.queueTickets,
        createdAt: branch.createdAt.toISOString(),
        updatedAt: branch.updatedAt.toISOString(),
      })),
    );
  } catch (error) {
    console.error("GET /api/branches error:", error);

    return NextResponse.json(
      {
        error: "Unable to load branches. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}

// POST /api/branches
// Creates a new branch.
// STAFF and ADMIN only.
export async function POST(request: Request) {
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

    const isStaff = session.user.role === "STAFF" || session.user.role === "ADMIN";

    if (!isStaff) {
      return NextResponse.json(
        {
          error: "You do not have permission to create a branch.",
        },
        {
          status: 403,
        },
      );
    }

    // Safely parse request body.
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

    // Server-side validation.
    const parsed = createBranchSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

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

    const { name, address, city } = parsed.data;

    try {
      const branch = await prisma.branch.create({
        data: {
          name,
          address,
          city,
        },
      });

      return NextResponse.json(
        {
          message: "Branch created successfully.",
          branch: {
            id: branch.id,
            name: branch.name,
            address: branch.address,
            city: branch.city,
            queueTicketCount: 0,
            createdAt: branch.createdAt.toISOString(),
            updatedAt: branch.updatedAt.toISOString(),
          },
        },
        {
          status: 201,
        },
      );
    } catch (error) {
      // Handle database-level unique constraint errors.
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return NextResponse.json(
          {
            error: "A branch with these details already exists.",
          },
          {
            status: 409,
          },
        );
      }

      throw error;
    }
  } catch (error) {
    console.error("POST /api/branches error:", error);

    return NextResponse.json(
      {
        error: "Unable to create the branch. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}
