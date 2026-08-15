// lib/actions/queueTicket.ts

"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { QueueStatus } from "@/generated/prisma";
import { createTicketSchema } from "@/lib/validations/queue";

export type TicketState =
  | {
      error?: string;
      fieldErrors?: Record<string, string[]>;
      success?: string;
    }
  | undefined;

export async function createQueueTicket(
  _prevState: TicketState,
  formData: FormData
): Promise<TicketState> {
  try {
    // Check authentication
    const session = await auth();

    if (!session?.user?.id) {
      return {
        error: "You must be signed in to join the queue.",
      };
    }

    // Validate only user-provided fields.
    const parsed = createTicketSchema.safeParse({
      branchId: formData.get("branchId"),
      serviceType: formData.get("serviceType"),
    });

    if (!parsed.success) {
      return {
        error: "Please correct the highlighted fields.",
        fieldErrors:
          parsed.error.flatten().fieldErrors as Record<
            string,
            string[]
          >,
      };
    }

    const { branchId, serviceType } = parsed.data;

    // Verify that the selected branch exists.
    const branch = await prisma.branch.findUnique({
      where: {
        id: branchId,
      },
    });

    if (!branch) {
      return {
        error: "The selected branch could not be found.",
        fieldErrors: {
          branchId: ["Please select a valid branch."],
        },
      };
    }

    // Find the latest ticket number for this branch.
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

    // Create the queue ticket.
    await prisma.queueTicket.create({
      data: {
        ticketNumber,
        customerId: session.user.id,
        branchId,
        serviceType,
        status: QueueStatus.WAITING,
      },
    });

    // Refresh the queue page.
    revalidatePath("/dashboard/queue");

    return {
      success:
        "Your queue ticket has been created successfully.",
    };
  } catch (error) {
    console.error(
      "createQueueTicket error:",
      error
    );

    return {
      error:
        "Unable to create your ticket. Please try again.",
    };
  }
}