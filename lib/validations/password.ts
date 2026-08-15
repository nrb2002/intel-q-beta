// lib/validations/password.ts

import { z } from "zod";

/**
 * Schema used by the client form.
 *
 * Includes confirmPassword and cross-field refinements.
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required."),

    newPassword: z
      .string()
      .min(
        8,
        "New password must be at least 8 characters."
      )
      .max(
        32,
        "New password must be at most 32 characters."
      ),

    confirmPassword: z
      .string()
      .min(
        1,
        "Please confirm your new password."
      ),
  })
  .refine(
    (data) =>
      data.newPassword === data.confirmPassword,
    {
      message: "New passwords do not match.",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) =>
      data.currentPassword !== data.newPassword,
    {
      message:
        "New password must be different from your current password.",
      path: ["newPassword"],
    }
  );

/**
 * Schema used by the API.
 *
 * IMPORTANT:
 * Do not use .pick() on changePasswordSchema
 * because changePasswordSchema contains refinements.
 */
export const changePasswordRequestSchema =
  z.object({
    currentPassword: z
      .string()
      .min(1, "Current password is required."),

    newPassword: z
      .string()
      .min(
        8,
        "New password must be at least 8 characters."
      )
      .max(
        32,
        "New password must be at most 32 characters."
      ),
  });

export type ChangePasswordInput = z.infer<
  typeof changePasswordSchema
>;

export type ChangePasswordRequest = z.infer<
  typeof changePasswordRequestSchema
>;