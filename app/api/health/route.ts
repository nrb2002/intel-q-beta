// app/api/health/route.ts

import { prisma } from "@/lib/db";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return Response.json(
      {
        status: "ok",
        db: "connected",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "GET /api/health error:",
      error,
    );

    return Response.json(
      {
        status: "error",
        db: "disconnected",
      },
      {
        status: 503,
      },
    );
  }
}