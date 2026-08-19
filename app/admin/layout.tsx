// app/admin/layout.tsx

import { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardShell
      sidebar={<AdminSidebar />}
      header={<AdminHeader />}
    >
      {children}
    </DashboardShell>
  );
}