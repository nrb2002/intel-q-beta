// components/queue/QueueList.tsx

import { QueueTicketCard } from "./QueueTicketCard";
import type { QueueTicket } from "@/types/queue";

interface QueueListProps {
  tickets: QueueTicket[];
  emptyMessage?: string;
}

export function QueueList({
  tickets,
  emptyMessage = "You currently do not have any queue tickets.",
}: QueueListProps) {
  if (tickets.length === 0) {
    return (
      <div
        className="rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-6 py-10 text-center"
        role="status"
      >
        <h3 className="text-base font-semibold text-[#1E293B]">
          No queue tickets found
        </h3>

        <p className="mt-2 text-sm text-[#64748B]">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div
      className="space-y-4"
      role="list"
      aria-label="Queue tickets"
    >
      {tickets.map((ticket) => (
        <div key={ticket.id} role="listitem">
          <QueueTicketCard
            ticketNumber={ticket.ticketNumber}
            customerName={ticket.customerName}
            branchName={ticket.branchName}
            serviceType={ticket.serviceType}
            status={ticket.status}
            createdAt={ticket.createdAt}
            calledAt={ticket.calledAt}
          />
        </div>
      ))}
    </div>
  );
}