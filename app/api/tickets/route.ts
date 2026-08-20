import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { QueueStatus } from "@/generated/prisma";
import { createTicketSchema } from "@/lib/validations/queue";
import { requireRole } from "@/lib/auth/authorization";

// GET /api/tickets
//
// STAFF and ADMIN users can view all tickets.
// Customers and unauthenticated users cannot access this endpoint.

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

      // QueueTicket currently stores the selected service
      // as a string rather than a Service relation.
      serviceType: ticket.serviceType,

      status: ticket.status,

      createdAt: ticket.createdAt.toISOString(),

      calledAt: ticket.calledAt?.toISOString() ?? null,

      completedAt: ticket.completedAt?.toISOString() ?? null,
    }));

    return NextResponse.json(formattedTickets, {
      status: 200,
    });
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
          error: "Forbidden.",
        },
        {
          status: 403,
        },
      );
    }

    console.error("GET /api/tickets error:", error);

    return NextResponse.json(
      {
        error: "Unable to load tickets.",
      },
      {
        status: 500,
      },
    );
  }
}

// POST /api/tickets
//
// PUBLIC customer ticket issuance.
//
// No authentication is required.
//
// Expected request:
//
// {
//   branchId: string,
//   serviceType: string,
//   firstName: string
// }

export async function POST(request: Request) {
  try {
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

    const requestBody =
      body as Record<string, unknown>;

    /*
     * Public customers do not authenticate.
     *
     * They only provide their first name when
     * requesting a queue ticket.
     */
    const firstName =
      typeof requestBody.firstName === "string"
        ? requestBody.firstName.trim()
        : "";

    if (!firstName) {
      return NextResponse.json(
        {
          error: "First name is required.",

          fieldErrors: {
            firstName: [
              "Please enter your first name.",
            ],
          },
        },
        {
          status: 400,
        },
      );
    }

    if (firstName.length > 100) {
      return NextResponse.json(
        {
          error: "First name is too long.",

          fieldErrors: {
            firstName: [
              "First name must be 100 characters or fewer.",
            ],
          },
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Validate branch and service information.
     */
    const parsed =
      createTicketSchema.safeParse({
        branchId: requestBody.branchId,
        serviceType: requestBody.serviceType,
      });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            "Please correct the highlighted fields.",

          fieldErrors:
            parsed.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const {
      branchId,
      serviceType,
    } = parsed.data;

    /*
     * Verify that the selected branch exists.
     */
    const branch =
      await prisma.branch.findUnique({
        where: {
          id: branchId,
        },
      });

    if (!branch) {
      return NextResponse.json(
        {
          error:
            "The selected branch could not be found.",

          fieldErrors: {
            branchId: [
              "Please select a valid branch.",
            ],
          },
        },
        {
          status: 404,
        },
      );
    }

    /*
     * Find the latest ticket number for
     * this branch.
     */
    const latestTicket =
      await prisma.queueTicket.findFirst({
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

    const ticketNumber =
      (latestTicket?.ticketNumber ?? 0) + 1;

    /*
     * Create the public ticket.
     *
     * customerId is NULL because the customer
     * does not need an account.
     *
     * customerName stores the name entered
     * during the public ticket process.
     */
    const ticket =
      await prisma.queueTicket.create({
        data: {
          ticketNumber,

          customerId: null,

          customerName: firstName,

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

    /*
     * Return the newly created ticket.
     */
    return NextResponse.json(
      {
        message:
          "Queue ticket created successfully.",

        ticket: {
          id: ticket.id,

          ticketNumber:
            ticket.ticketNumber,

          customerName:
            ticket.customerName,

          customer: ticket.customer
            ? {
                id: ticket.customer.id,
                firstName:
                  ticket.customer.firstName,
                lastName:
                  ticket.customer.lastName,
                email:
                  ticket.customer.email,
              }
            : null,

          branch: {
            id: ticket.branch.id,
            name: ticket.branch.name,
            address:
              ticket.branch.address,
            city: ticket.branch.city,
          },

          branchName:
            ticket.branch.name,

          // The current schema stores the
          // service as a string.
          serviceType:
            ticket.serviceType,

          status: ticket.status,

          createdAt:
            ticket.createdAt.toISOString(),

          calledAt:
            ticket.calledAt?.toISOString() ??
            null,

          completedAt:
            ticket.completedAt?.toISOString() ??
            null,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "POST /api/tickets error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to create your ticket. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}