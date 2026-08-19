// app/staff/layout.tsx

import { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StaffSidebar } from "@/components/staff/StaffSidebar";
import { StaffHeader } from "@/components/staff/StaffHeader";

export default function StaffLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardShell
      sidebar={<StaffSidebar />}
      header={<StaffHeader />}
    >
      {children}
    </DashboardShell>
  );
}