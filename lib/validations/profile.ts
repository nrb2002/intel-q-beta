// lib/validations/profile.ts

import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(50, "First name must be 50 characters or less."),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(50, "Last name must be 50 characters or less."),
});

export type UpdateProfileInput = z.infer<
  typeof updateProfileSchema
>;