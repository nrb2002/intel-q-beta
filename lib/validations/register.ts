// lib/validations/register.ts

import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required.")
      .max(
        50,
        "First name must be 50 characters or less."
      ),

    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required.")
      .max(
        50,
        "Last name must be 50 characters or less."
      ),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email address.")
      .max(
        255,
        "Email address must be 255 characters or less."
      )
      .transform((value) => value.toLowerCase()),

    password: z
      .string()
      .min(
        8,
        "Password must be at least 8 characters."
      )
      .max(
        32,
        "Password must be at most 32 characters."
      ),

    confirmPassword: z
      .string()
      .min(
        1,
        "Please confirm your password."
      ),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    }
  );

export type RegisterInput = z.infer<
  typeof registerSchema
>;