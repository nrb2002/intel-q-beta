// components/queue/QueueStatusBadge.tsx

import type { QueueStatus } from "@/types/queue";
import { cn } from "@/lib/utils";

interface QueueStatusBadgeProps {
  status: QueueStatus;
}

const statusStyles: Record<QueueStatus, string> = {
  WAITING: "bg-amber-100 text-amber-700",
  IN_SERVICE: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const statusLabels: Record<QueueStatus, string> = {
  WAITING: "Waiting",
  IN_SERVICE: "In Service",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export function QueueStatusBadge({
  status,
}: QueueStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center",
        "rounded-full",
        "px-3 py-1",
        "text-xs",
        "font-medium",
        statusStyles[status]
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
