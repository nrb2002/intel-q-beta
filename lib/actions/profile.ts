"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { updateProfileSchema } from "@/lib/validations/profile";

export type ProfileState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: string;
} | undefined;

export async function updateProfile(
  _prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in to do this." };
  }

  const parsed = updateProfileSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: parsed.data,
    });

    revalidatePath("/dashboard/profile");
    return { success: "Your profile has been updated successfully." };
  } catch (error) {
    console.error("Profile update failed:", error);
    return { error: "Unable to update your profile. Please try again." };
  }
}