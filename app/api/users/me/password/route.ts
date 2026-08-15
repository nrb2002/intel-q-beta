// app/api/users/me/password/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { changePasswordRequestSchema } from "@/lib/validations/password";

export async function PATCH(request: Request) {
  try {
    // Check authentication
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    // Parse request body
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid request data.",
        },
        {
          status: 400,
        },
      );
    }

    // Server-side validation
    //
    // The API receives currentPassword and newPassword.
    // confirmPassword is a client-side concern.
    const result = changePasswordRequestSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (typeof field === "string" && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }

      return NextResponse.json(
        {
          error: "Please correct the highlighted fields.",
          fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const { currentPassword, newPassword } = result.data;

    // Get the authenticated user
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Unable to update your password.",
        },
        {
          status: 404,
        },
      );
    }

    // Verify current password
    const passwordMatches = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatches) {
      return NextResponse.json(
        {
          error: "Current password is incorrect.",
        },
        {
          status: 400,
        },
      );
    }

    // Extra server-side protection
    // Prevent reusing the current password.
    const samePassword = await bcrypt.compare(newPassword, user.password);

    if (samePassword) {
      return NextResponse.json(
        {
          error: "New password must be different from your current password.",
          fieldErrors: {
            newPassword: "New password must be different from your current password.",
          },
        },
        {
          status: 400,
        },
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "Your password has been changed successfully.",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("PATCH /api/users/me/password error:", error);

    return NextResponse.json(
      {
        error: "Unable to change your password. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}
