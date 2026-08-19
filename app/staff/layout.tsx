// app/staff/layout.tsx

import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { requireStaff } from "@/lib/auth/authorization";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StaffSidebar } from "@/components/staff/StaffSidebar";
import { StaffHeader } from "@/components/staff/StaffHeader";

export default async function StaffLayout({
  children,
}: {
  children: ReactNode;
}) {
  try {
    await requireStaff();
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
    ) {
      redirect("/login/staff");
    }

    redirect("/forbidden");
  }

  return (
    <DashboardShell
      sidebar={<StaffSidebar />}
      header={<StaffHeader />}
    >
      {children}
    </DashboardShell>
  );
}