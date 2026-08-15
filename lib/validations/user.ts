import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50),
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["customer", "staff", "admin"]).default("customer"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;