"use server";

import { prisma } from "@/lib/prisma";
import { PasswordHasher } from "@/util";
import { registerSchema } from "@/lib/validations/register";

export type RegisterState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: string;
} | undefined;

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { firstName, lastName, password } = parsed.data;
  const email = parsed.data.email.toLowerCase();

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "An account with this email already exists." };
    }

    const hashedPassword = await PasswordHasher.hash(password);

    await prisma.user.create({
      data: { firstName, lastName, email, password: hashedPassword, role: "CUSTOMER" },
    });

    return { success: "Account created successfully! You can now sign in." };
  } catch (error) {
    console.error("Registration failed:", error);
    return { error: "Something went wrong. Please try again." };
  }
}