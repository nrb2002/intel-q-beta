// lib/validations/queue.ts

import { z } from "zod";

export const createTicketSchema = z.object({
  branchId: z
    .string()
    .trim()
    .min(1, "Please select a branch."),

  serviceType: z
    .string()
    .trim()
    .min(
      2,
      "Please provide a bit more detail about the service you need."
    )
    .max(
      100,
      "Service description must be 100 characters or less."
    ),
});

export type CreateTicketInput = z.infer<
  typeof createTicketSchema
>;