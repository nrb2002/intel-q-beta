// app/api/queues/route.ts

import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { requireRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/db";
import { QueueStatus } from "@/generated/prisma";
import { createTicketSchema } from "@/lib/validations/queue";

// GET /api/queues
//
// STAFF and ADMIN users can view all queue tickets.
// Customers and unauthenticated users cannot access
// this staff queue-management endpoint.

export async function GET() {
  try {
    await requireRole("STAFF");

    const tickets = await prisma.queueTicket.findMany({
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },

        branch: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedTickets = tickets.map((ticket) => ({
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      customerName: `${ticket.customer.firstName} ${ticket.customer.lastName}`,
      branchName: ticket.branch.name,
      serviceType: ticket.serviceType,
      status: ticket.status,
      createdAt: ticket.createdAt.toISOString(),
      calledAt: ticket.calledAt?.toISOString(),
      completedAt: ticket.completedAt?.toISOString(),
    }));

    return NextResponse.json(formattedTickets, {
      status: 200,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json(
        {
          error: "Forbidden.",
        },
        {
          status: 403,
        },
      );
    }

    console.error("GET /api/queues error:", error);

    return NextResponse.json(
      {
        error: "Unable to load queue tickets. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}

// POST /api/queues
//
// Creates a queue ticket for an authenticated customer.
//
// NOTE:
// The public customer ticket flow will eventually use
// an unauthenticated ticket-creation endpoint. This
// handler currently remains authenticated because the
// existing QueueTicket model requires customerId.

export async function POST(request: Request) {
  try {
    const session = await auth();

    // The current implementation requires an authenticated
    // customer because customerId is currently taken from
    // the authenticated session.
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

    // Safely parse the request body.
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

    // Validate the request using the shared Zod schema.
    const parsed = createTicketSchema.safeParse(body);

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

    const { branchId, serviceType } = parsed.data;

    // Verify that the selected branch exists.
    const branch = await prisma.branch.findUnique({
      where: {
        id: branchId,
      },
    });

    if (!branch) {
      return NextResponse.json(
        {
          error: "The selected branch could not be found.",

          fieldErrors: {
            branchId: ["Please select a valid branch."],
          },
        },
        {
          status: 404,
        },
      );
    }

    // Find the latest ticket number for this branch.
    const latestTicket = await prisma.queueTicket.findFirst({
      where: {
        branchId,
      },

      orderBy: {
        ticketNumber: "desc",
      },

      select: {
        ticketNumber: true,
      },
    });

    // Generate the next ticket number.
    const ticketNumber = (latestTicket?.ticketNumber ?? 0) + 1;

    // Create the queue ticket.
    const ticket = await prisma.queueTicket.create({
      data: {
        ticketNumber,
        customerId: session.user.id,
        branchId,
        serviceType,
        status: QueueStatus.WAITING,
      },

      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },

        branch: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
          },
        },
      },
    });

    // Return the newly created ticket.
    return NextResponse.json(
      {
        message: "Queue ticket created successfully.",

        ticket: {
          id: ticket.id,
          ticketNumber: ticket.ticketNumber,
          customerName: `${ticket.customer.firstName} ${ticket.customer.lastName}`,
          branchName: ticket.branch.name,
          serviceType: ticket.serviceType,
          status: ticket.status,
          createdAt: ticket.createdAt.toISOString(),
          calledAt: ticket.calledAt?.toISOString(),
          completedAt: ticket.completedAt?.toISOString(),
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("POST /api/queues error:", error);

    return NextResponse.json(
      {
        error: "Unable to create your queue ticket. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}
