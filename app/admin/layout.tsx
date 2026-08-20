// app/admin/layout.tsx

import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/authorization";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      redirect("/login/admin");
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      redirect("/forbidden");
    }

    console.error("Admin layout authorization error:", error);

    redirect("/forbidden");
  }

  return (
    <DashboardShell sidebar={<AdminSidebar />} header={<AdminHeader />}>
      {children}
    </DashboardShell>
  );
}
