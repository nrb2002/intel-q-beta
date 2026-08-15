"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createBranchSchema } from "@/lib/validations/branch";

export type BranchState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: string;
} | undefined;

export async function createBranch(
  _prevState: BranchState,
  formData: FormData
): Promise<BranchState> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "You do not have permission to perform this action." };
  }

  const parsed = createBranchSchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    city: formData.get("city"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await prisma.branch.create({ data: parsed.data });
    revalidatePath("/dashboard/branches");
    return { success: "Branch created successfully." };
  } catch (error) {
    console.error("Branch creation failed:", error);
    return { error: "Unable to create branch. Please try again." };
  }
}