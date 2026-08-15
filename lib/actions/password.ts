"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PasswordHasher } from "@/util";
import { changePasswordSchema } from "@/lib/validations/password";

export type PasswordState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: string;
} | undefined;

export async function changePassword(
  _prevState: PasswordState,
  formData: FormData
): Promise<PasswordState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in to do this." };
  }

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) {
      return { error: "Unable to update your password. Please try again." };
    }

    const currentMatches = await PasswordHasher.compare(
      parsed.data.currentPassword,
      user.password
    );
    if (!currentMatches) {
      return {
        error: "Please fix the errors below.",
        fieldErrors: { currentPassword: ["Current password is incorrect."] },
      };
    }

    const hashedNewPassword = await PasswordHasher.hash(parsed.data.newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

    return { success: "Your password has been changed successfully." };
  } catch (error) {
    console.error("Password change failed:", error);
    return { error: "Unable to update your password. Please try again." };
  }
}