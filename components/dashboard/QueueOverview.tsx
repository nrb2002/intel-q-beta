import { DashboardCard } from "./DashboardCard";
import { QueueList } from "@/components/queue/QueueList";

const tickets = [
  {
    id: "Q001",
    ticketNumber: 1,
    customerName: "John Smith",
    branchName: "Intel-Q Main Branch",
    serviceType: "Account Opening",
    status: "WAITING" as const,
    createdAt: "09:30 AM",
  },
  {
    id: "Q002",
    ticketNumber: 2,
    customerName: "Mary Jones",
    branchName: "Intel-Q Main Branch",
    serviceType: "Loan Application",
    status: "IN_SERVICE" as const,
    createdAt: "09:45 AM",
  },
  {
    id: "Q003",
    ticketNumber: 3,
    customerName: "David Brown",
    branchName: "Intel-Q Main Branch",
    serviceType: "Support",
    status: "COMPLETED" as const,
    createdAt: "10:00 AM",
  },
];


export function QueueOverview() {
  return (
    <DashboardCard
      title="Active Queue"
      description="Current customer queue status"
    >

      <QueueList tickets={tickets} />

    </DashboardCard>
  );
}