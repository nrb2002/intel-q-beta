// lib/validations/branch.ts

import { z } from "zod";

export const createBranchSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Branch name is required.")
    .min(2, "Branch name must be at least 2 characters.")
    .max(
      100,
      "Branch name must be 100 characters or less.",
    ),

  address: z
    .string()
    .trim()
    .min(1, "Address is required.")
    .min(5, "Address must be at least 5 characters.")
    .max(
      200,
      "Address must be 200 characters or less.",
    ),

  city: z
    .string()
    .trim()
    .min(1, "City is required.")
    .min(2, "City must be at least 2 characters.")
    .max(
      100,
      "City must be 100 characters or less.",
    ),
});

export type CreateBranchInput = z.infer<
  typeof createBranchSchema
>;