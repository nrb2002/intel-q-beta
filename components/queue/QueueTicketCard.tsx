// components/queue/QueueTicketCard.tsx

import type { QueueStatus } from "@/types/queue";
import { Card } from "@/components/ui/Card";
import { QueueStatusBadge } from "./QueueStatusBadge";

interface QueueTicketCardProps {
  ticketNumber: number;
  customerName?: string;
  branchName: string;
  serviceType: string;
  status: QueueStatus;
  createdAt: string;
  calledAt?: string;
}

export function QueueTicketCard({
  ticketNumber,
  customerName,
  branchName,
  serviceType,
  status,
  createdAt,
  calledAt,
}: QueueTicketCardProps) {
  return (
    <Card>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[#64748B]">
            Ticket Number
          </p>

          <h2 className="mt-1 text-3xl font-bold text-[#2563EB]">
            #{ticketNumber}
          </h2>
        </div>

        <QueueStatusBadge status={status} />
      </div>

      {/* Details */}
      <div className="mt-6 space-y-3">
        {customerName && (
          <div className="flex items-start justify-between gap-4">
            <span className="text-[#64748B]">
              Customer
            </span>

            <span className="text-right font-medium text-[#1E293B]">
              {customerName}
            </span>
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          <span className="text-[#64748B]">
            Branch
          </span>

          <span className="text-right font-medium text-[#1E293B]">
            {branchName}
          </span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <span className="text-[#64748B]">
            Service
          </span>

          <span className="text-right font-medium text-[#1E293B]">
            {serviceType}
          </span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <span className="text-[#64748B]">
            Created
          </span>

          <span className="text-right text-[#1E293B]">
            {createdAt}
          </span>
        </div>

        {calledAt && (
          <div className="flex items-start justify-between gap-4">
            <span className="text-[#64748B]">
              Called
            </span>

            <span className="text-right text-[#1E293B]">
              {calledAt}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}