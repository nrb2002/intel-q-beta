// app/api/tickets/[id]/route.ts

import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { QueueStatus } from "@/generated/prisma";
import { requireRole } from "@/lib/auth/authorization";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Convert a Prisma QueueTicket into the API response shape.
 *
 * Public customers have:
 *   customerId = null
 *
 * Therefore customerName must come from QueueTicket.customerName
 * rather than ticket.customer.firstName.
 */
function formatTicket(ticket: {
  id: string;
  ticketNumber: number;
  customerId: string | null;
  customerName: string;
  serviceType: string;
  status: QueueStatus;
  createdAt: Date;
  calledAt: Date | null;
  completedAt: Date | null;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  branch: {
    id: string;
    name: string;
    address: string;
    city: string;
  };
}) {
  return {
    id: ticket.id,

    ticketNumber: ticket.ticketNumber,

    customerName: ticket.customerName,

    customer: ticket.customer
      ? {
          id: ticket.customer.id,
          firstName: ticket.customer.firstName,
          lastName: ticket.customer.lastName,
          email: ticket.customer.email,
        }
      : null,

    branch: {
      id: ticket.branch.id,
      name: ticket.branch.name,
      address: ticket.branch.address,
      city: ticket.branch.city,
    },

    branchName: ticket.branch.name,

    serviceType: ticket.serviceType,

    status: ticket.status,

    createdAt: ticket.createdAt.toISOString(),

    calledAt: ticket.calledAt?.toISOString() ?? null,

    completedAt: ticket.completedAt?.toISOString() ?? null,
  };
}

// GET /api/tickets/[id]
//
// STAFF and ADMIN users can view a ticket.

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireRole("STAFF");

    const { id } = await context.params;

    const ticket = await prisma.queueTicket.findUnique({
      where: {
        id,
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

    if (!ticket) {
      return NextResponse.json(
        {
          error: "Ticket not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(formatTicket(ticket), {
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

    console.error("GET /api/tickets/[id] error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch ticket.",
      },
      {
        status: 500,
      },
    );
  }
}

// PATCH /api/tickets/[id]
//
// STAFF and ADMIN users can transition tickets.

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireRole("STAFF");

    const { id } = await context.params;

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

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return NextResponse.json(
        {
          error: "Invalid request data.",
        },
        {
          status: 400,
        },
      );
    }

    const requestBody = body as Record<string, unknown>;

    const status = typeof requestBody.status === "string" ? requestBody.status : undefined;

    if (!status) {
      return NextResponse.json(
        {
          error: "Ticket status is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!Object.values(QueueStatus).includes(status as QueueStatus)) {
      return NextResponse.json(
        {
          error: "Invalid queue status.",
        },
        {
          status: 400,
        },
      );
    }

    const existingTicket = await prisma.queueTicket.findUnique({
      where: {
        id,
      },
    });

    if (!existingTicket) {
      return NextResponse.json(
        {
          error: "Ticket not found.",
        },
        {
          status: 404,
        },
      );
    }

    const nextStatus = status as QueueStatus;

    const updateData: {
      status: QueueStatus;
      calledAt?: Date | null;
      completedAt?: Date | null;
    } = {
      status: nextStatus,
    };

    switch (nextStatus) {
      case QueueStatus.IN_SERVICE:
        updateData.calledAt = existingTicket.calledAt ?? new Date();
        break;

      case QueueStatus.COMPLETED:
        updateData.completedAt = new Date();
        break;

      case QueueStatus.WAITING:
        updateData.calledAt = null;
        updateData.completedAt = null;
        break;

      case QueueStatus.CANCELLED:
        updateData.completedAt = null;
        break;

      default:
        break;
    }

    const ticket = await prisma.queueTicket.update({
      where: {
        id,
      },

      data: updateData,

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

    return NextResponse.json(formatTicket(ticket), {
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

    console.error("PATCH /api/tickets/[id] error:", error);

    return NextResponse.json(
      {
        error: "Failed to update ticket.",
      },
      {
        status: 500,
      },
    );
  }
}

// DELETE /api/tickets/[id]
//
// Only ADMIN users can delete tickets.

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireRole("ADMIN");

    const { id } = await context.params;

    const ticket = await prisma.queueTicket.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
      },
    });

    if (!ticket) {
      return NextResponse.json(
        {
          error: "Ticket not found.",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.queueTicket.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        message: "Ticket deleted successfully.",
      },
      {
        status: 200,
      },
    );
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

    console.error("DELETE /api/tickets/[id] error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete ticket.",
      },
      {
        status: 500,
      },
    );
  }
}
