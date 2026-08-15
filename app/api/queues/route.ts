// app/api/queues/route.ts

import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { QueueStatus } from "@/generated/prisma";
import { createTicketSchema } from "@/lib/validations/queue";

// GET /api/queues
//
// Returns queue tickets for the authenticated user.
//
// STAFF and ADMIN users can see all tickets.
// CUSTOMER users can only see their own tickets.

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

    const isStaff = session.user.role === "STAFF" || session.user.role === "ADMIN";

    const tickets = await prisma.queueTicket.findMany({
      where: isStaff
        ? undefined
        : {
            customerId: session.user.id,
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
// Creates a queue ticket for the authenticated customer.

export async function POST(request: Request) {
  try {
    const session = await auth();

    // Make sure the user is authenticated.
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
