// app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validations/register";

export async function POST(request: Request) {
  try {
    let body: unknown;

    // Safely parse request body
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

    // Server-side Zod validation
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

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

    const { firstName, lastName, email, password } = parsed.data;

    // Check whether the email is already registered
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "An account with this email already exists.",
        },
        {
          status: 409,
        },
      );
    }

    // Hash password before storing it
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: "CUSTOMER",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(
      {
        message: "Account created successfully.",
        user,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("POST /api/auth/register error:", error);

    return NextResponse.json(
      {
        error: "Unable to create your account. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}
