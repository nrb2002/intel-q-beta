// app/api/queues/[id]/route.ts

import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { QueueStatus } from "@/generated/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/queues/[id]

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      return NextResponse.json({ error: "Queue ticket not found." }, { status: 404 });
    }

    const isStaff = session.user.role === "STAFF" || session.user.role === "ADMIN";

    if (!isStaff && ticket.customerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      customerName: `${ticket.customer.firstName} ${ticket.customer.lastName}`,
      branchName: ticket.branch.name,
      serviceType: ticket.serviceType,
      status: ticket.status,
      createdAt: ticket.createdAt.toISOString(),
      calledAt: ticket.calledAt?.toISOString(),
      completedAt: ticket.completedAt?.toISOString(),
    });
  } catch (error) {
    console.error("GET /api/queues/[id] error:", error);

    return NextResponse.json({ error: "Failed to fetch queue ticket." }, { status: 500 });
  }
}

// PATCH /api/queues/[id]

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const isStaff = session.user.role === "STAFF" || session.user.role === "ADMIN";

    if (!isStaff) {
      return NextResponse.json(
        {
          error: "Only staff members can update queue tickets.",
        },
        { status: 403 },
      );
    }

    const body = await request.json();

    const status = typeof body.status === "string" ? body.status : undefined;

    if (status && !Object.values(QueueStatus).includes(status as QueueStatus)) {
      return NextResponse.json({ error: "Invalid queue status." }, { status: 400 });
    }

    const existingTicket = await prisma.queueTicket.findUnique({
      where: {
        id,
      },
    });

    if (!existingTicket) {
      return NextResponse.json({ error: "Queue ticket not found." }, { status: 404 });
    }

    const updateData: {
      status?: QueueStatus;
      calledAt?: Date | null;
      completedAt?: Date | null;
    } = {};

    if (status) {
      updateData.status = status as QueueStatus;

      if (status === "IN_SERVICE") {
        updateData.calledAt = existingTicket.calledAt ?? new Date();
      }

      if (status === "COMPLETED") {
        updateData.completedAt = new Date();
      }

      if (status === "WAITING") {
        updateData.calledAt = null;
        updateData.completedAt = null;
      }

      if (status === "CANCELLED") {
        updateData.completedAt = null;
      }
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

    return NextResponse.json({
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      customerName: `${ticket.customer.firstName} ${ticket.customer.lastName}`,
      branchName: ticket.branch.name,
      serviceType: ticket.serviceType,
      status: ticket.status,
      createdAt: ticket.createdAt.toISOString(),
      calledAt: ticket.calledAt?.toISOString(),
      completedAt: ticket.completedAt?.toISOString(),
    });
  } catch (error) {
    console.error("PATCH /api/queues/[id] error:", error);

    return NextResponse.json({ error: "Failed to update queue ticket." }, { status: 500 });
  }
}

// DELETE /api/queues/[id]

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const ticket = await prisma.queueTicket.findUnique({
      where: {
        id,
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Queue ticket not found." }, { status: 404 });
    }

    const isStaff = session.user.role === "STAFF" || session.user.role === "ADMIN";

    if (!isStaff && ticket.customerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.queueTicket.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Queue ticket deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/queues/[id] error:", error);

    return NextResponse.json({ error: "Failed to delete queue ticket." }, { status: 500 });
  }
}
